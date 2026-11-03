const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let pg = null;
try {
    pg = require('pg');
} catch (e) {
    // pg no instalado o no disponible
}

const BASE_DIR = __dirname;
const LOCAL_DB_PATH = path.join(BASE_DIR, 'database_store.json');

let pool = null;
let usePostgres = false;

// -------------------------------------------------------------
// BASE DE DATOS LOCAL PERSISTENTE (Fallback seguro y autónomo)
// -------------------------------------------------------------
function cargarBaseLocal() {
    try {
        if (fs.existsSync(LOCAL_DB_PATH)) {
            return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
        }
    } catch (e) {
        console.error('[DB] Error leyendo base local:', e.message);
    }
    return {
        usuarios: [
            {
                id: 1,
                username: 'admin',
                password: 'admin1',
                nombreCompleto: 'VALENTIN PACOMPIA PANDA',
                agencia: 'TACNA - HUGO CHURA Y ASOCIADOS CORREDORES',
                rol: 'ADMIN',
                creadoEn: new Date().toISOString()
            }
        ],
        sesiones: [],
        vehiculos: {},
        ventas: []
    };
}

function guardarBaseLocal(data) {
    try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error('[DB] Error guardando base local:', e.message);
        return false;
    }
}

// Inicializar y migrar vehículos existentes de vehiculos_db.json
function sincronizarVehiculosIniciales(dbLocal) {}

async function initDB(databaseUrl) {
    let localData = cargarBaseLocal();
    guardarBaseLocal(localData);

    if (databaseUrl && databaseUrl.startsWith('postgres') && pg) {
        try {
            console.log('[DB] Intentando conectar a PostgreSQL configurado en .env...');
            pool = new pg.Pool({
                connectionString: databaseUrl,
                connectionTimeoutMillis: 3000
            });

            // Verificar conexión
            const res = await pool.query('SELECT NOW()');
            usePostgres = true;
            console.log(`[DB] Conectado exitosamente a PostgreSQL (${res.rows[0].now})`);

            // Crear tablas en PostgreSQL si no existen
            await pool.query(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL,
                    nombre_completo VARCHAR(150),
                    agencia VARCHAR(150),
                    rol VARCHAR(30) DEFAULT 'ADMIN',
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS sesiones (
                    token VARCHAR(100) PRIMARY KEY,
                    user_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
                    username VARCHAR(50),
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expira_en TIMESTAMP NOT NULL
                );

                CREATE TABLE IF NOT EXISTS vehiculos (
                    placa VARCHAR(20) PRIMARY KEY,
                    clase VARCHAR(50),
                    marca VARCHAR(50),
                    modelo VARCHAR(50),
                    modelo_especifico VARCHAR(100),
                    serie VARCHAR(100),
                    anio VARCHAR(10),
                    asientos VARCHAR(10),
                    uso VARCHAR(50),
                    categoria VARCHAR(20),
                    version VARCHAR(50),
                    zona VARCHAR(50),
                    monto VARCHAR(30),
                    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS ventas (
                    id SERIAL PRIMARY KEY,
                    placa VARCHAR(20),
                    numero_poliza VARCHAR(50),
                    contratante_nombre VARCHAR(150),
                    contratante_documento VARCHAR(30),
                    monto NUMERIC(10,2),
                    forma_pago VARCHAR(50),
                    emitido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Asegurar usuario admin por defecto en PostgreSQL
            const userCheck = await pool.query('SELECT id FROM usuarios WHERE username = $1', ['admin']);
            if (userCheck.rows.length === 0) {
                await pool.query(`
                    INSERT INTO usuarios (username, password, nombre_completo, agencia, rol)
                    VALUES ($1, $2, $3, $4, $5)
                `, ['admin', 'admin1', 'VALENTIN PACOMPIA PANDA', 'TACNA - HUGO CHURA Y ASOCIADOS CORREDORES', 'ADMIN']);
                console.log('[DB] Usuario "admin" creado en PostgreSQL.');
            }

            // Sincronizar vehículos de catálogo inicial a PostgreSQL
            // Catálogo limpio

            return { tipo: 'POSTGRESQL', estado: 'CONECTADO' };
        } catch (err) {
            console.log(`[DB] No se pudo conectar a PostgreSQL (${err.message}). Usando base de datos persistente local.`);
            usePostgres = false;
        }
    }

    console.log('[DB] Base de datos activa: Motor Local Autónomo (database_store.json)');
    return { tipo: 'SQL_LOCAL', estado: 'ACTIVO' };
}

// -------------------------------------------------------------
// OPERACIONES DE USUARIOS Y AUTENTICACIÓN
// -------------------------------------------------------------
async function autenticarUsuario(username, password) {
    if (usePostgres && pool) {
        try {
            const res = await pool.query(
                'SELECT * FROM usuarios WHERE LOWER(username) = LOWER($1) AND password = $2',
                [username, password]
            );
            if (res.rows.length > 0) {
                const u = res.rows[0];
                return {
                    id: u.id,
                    username: u.username,
                    nombreCompleto: u.nombre_completo,
                    agencia: u.agencia,
                    rol: u.rol
                };
            }
            return null;
        } catch (e) {
            console.error('[DB] Error autenticando en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    const u = db.usuarios.find(
        x => x.username.toLowerCase() === username.toLowerCase() && x.password === password
    );
    if (u) {
        return {
            id: u.id,
            username: u.username,
            nombreCompleto: u.nombreCompleto,
            agencia: u.agencia,
            rol: u.rol
        };
    }
    return null;
}

// Crear sesión al iniciar sesión
async function crearSesion(usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEn = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    if (usePostgres && pool) {
        try {
            await pool.query(
                'INSERT INTO sesiones (token, user_id, username, expira_en) VALUES ($1, $2, $3, $4)',
                [token, usuario.id, usuario.username, expiraEn]
            );
            return token;
        } catch (e) {
            console.error('[DB] Error creando sesión en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    // Limpiar sesiones viejas
    db.sesiones = db.sesiones.filter(s => new Date(s.expiraEn) > new Date());
    db.sesiones.push({
        token,
        userId: usuario.id,
        username: usuario.username,
        nombreCompleto: usuario.nombreCompleto,
        agencia: usuario.agencia,
        rol: usuario.rol,
        creadoEn: new Date().toISOString(),
        expiraEn: expiraEn.toISOString()
    });
    guardarBaseLocal(db);
    return token;
}

// Validar si un token de sesión es válido
async function validarSesion(token) {
    if (!token) return null;

    if (usePostgres && pool) {
        try {
            const res = await pool.query(
                `SELECT s.*, u.nombre_completo, u.agencia, u.rol 
                 FROM sesiones s 
                 JOIN usuarios u ON s.user_id = u.id 
                 WHERE s.token = $1 AND s.expira_en > NOW()`,
                [token]
            );
            if (res.rows.length > 0) {
                const row = res.rows[0];
                return {
                    userId: row.user_id,
                    username: row.username,
                    nombreCompleto: row.nombre_completo,
                    agencia: row.agencia,
                    rol: row.rol
                };
            }
            return null;
        } catch (e) {
            console.error('[DB] Error validando sesión en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    const s = db.sesiones.find(x => x.token === token && new Date(x.expiraEn) > new Date());
    if (s) {
        return {
            userId: s.userId,
            username: s.username,
            nombreCompleto: s.nombreCompleto,
            agencia: s.agencia,
            rol: s.rol
        };
    }
    return null;
}

// Eliminar sesión al cerrar sesión
async function destruirSesion(token) {
    if (!token) return true;

    if (usePostgres && pool) {
        try {
            await pool.query('DELETE FROM sesiones WHERE token = $1', [token]);
            return true;
        } catch (e) {}
    }

    const db = cargarBaseLocal();
    db.sesiones = db.sesiones.filter(s => s.token !== token);
    guardarBaseLocal(db);
    return true;
}

// -------------------------------------------------------------
// OPERACIONES DE VEHÍCULOS
// -------------------------------------------------------------
async function obtenerVehiculo(placa) {
    if (!placa) return null;
    const clean = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (usePostgres && pool) {
        try {
            const res = await pool.query(
                'SELECT * FROM vehiculos WHERE placa = $1 OR REPLACE(placa, \'-\', \'\') = $2',
                [placa, clean]
            );
            if (res.rows.length > 0) {
                const r = res.rows[0];
                return {
                    placa: r.placa,
                    clase: r.clase,
                    marca: r.marca,
                    modelo: r.modelo,
                    modeloEsp: r.modelo_especifico,
                    serie: r.serie,
                    anio: r.anio,
                    asientos: r.asientos,
                    uso: r.uso,
                    categoria: r.categoria,
                    version: r.version,
                    zona: r.zona,
                    monto: r.monto
                };
            }
        } catch (e) {
            console.error('[DB] Error buscando vehículo en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    return db.vehiculos[placa] || db.vehiculos[clean] || null;
}

async function guardarVehiculo(v) {
    if (!v || !v.placa) return false;
    const clean = v.placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (usePostgres && pool) {
        try {
            await pool.query(`
                INSERT INTO vehiculos (placa, clase, marca, modelo, modelo_especifico, serie, anio, asientos, uso, categoria, version, zona, monto, actualizado_en)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)
                ON CONFLICT (placa) DO UPDATE SET
                    clase = EXCLUDED.clase,
                    marca = EXCLUDED.marca,
                    modelo = EXCLUDED.modelo,
                    modelo_especifico = EXCLUDED.modelo_especifico,
                    serie = EXCLUDED.serie,
                    anio = EXCLUDED.anio,
                    asientos = EXCLUDED.asientos,
                    uso = EXCLUDED.uso,
                    categoria = EXCLUDED.categoria,
                    version = EXCLUDED.version,
                    zona = EXCLUDED.zona,
                    monto = EXCLUDED.monto,
                    actualizado_en = CURRENT_TIMESTAMP
            `, [
                v.placa, v.clase || 'AUTO', v.marca || '', v.modelo || '', v.modeloEsp || '',
                v.serie || '', v.anio || '', String(v.asientos || '5'), v.uso || 'PARTICULAR',
                v.categoria || 'M1', v.version || 'STD', v.zona || 'TACNA', v.monto || ''
            ]);
            return true;
        } catch (e) {
            console.error('[DB] Error guardando vehículo en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    db.vehiculos[v.placa] = v;
    db.vehiculos[clean] = v;
    guardarBaseLocal(db);
    return true;
}

module.exports = {
    initDB,
    autenticarUsuario,
    crearSesion,
    validarSesion,
    destruirSesion,
    obtenerVehiculo,
    guardarVehiculo,
    cargarBaseLocal
};

