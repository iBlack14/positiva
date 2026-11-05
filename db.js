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

function normalizarPlaca(value) {
    const clean = String(value || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (clean.length === 6) {
        return /^\d{4}[A-Z0-9]{2}$/.test(clean)
            ? `${clean.slice(0, 4)}-${clean.slice(4)}`
            : `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    if (clean.length === 5) {
        if (/^\d{3}[A-Z0-9]{2}$/.test(clean)) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
        if (/^[A-Z]{2}\d{3}$/.test(clean)) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    }
    return clean;
}

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
        ventas: [],
        registrosApeseg: []
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
    if (!Array.isArray(localData.registrosApeseg)) localData.registrosApeseg = [];
    guardarBaseLocal(localData);

    if (databaseUrl && databaseUrl.startsWith('postgres') && pg) {
        try {
            console.log('[DB] Intentando conectar a PostgreSQL configurado en .env...');
            pool = new pg.Pool({
                connectionString: databaseUrl,
                connectionTimeoutMillis: 3000,
                options: '-c timezone=America/Lima'
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
                    clase VARCHAR(50),
                    uso VARCHAR(50),
                    contratante_nombre VARCHAR(150),
                    contratante_documento VARCHAR(30),
                    monto NUMERIC(10,2),
                    forma_pago VARCHAR(50),
                    emitido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS registros_apeseg (
                    id SERIAL PRIMARY KEY,
                    placa VARCHAR(20) NOT NULL,
                    clase VARCHAR(50) NOT NULL,
                    compania VARCHAR(100) NOT NULL,
                    numero_poliza VARCHAR(100) NOT NULL,
                    estado VARCHAR(30) NOT NULL,
                    fecha_inicio DATE NOT NULL,
                    fecha_fin DATE NOT NULL,
                    tipo_soat VARCHAR(10),
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                ALTER TABLE registros_apeseg
                    ADD COLUMN IF NOT EXISTS tipo_soat VARCHAR(10);

                ALTER TABLE registros_apeseg
                    ADD COLUMN IF NOT EXISTS clase VARCHAR(50);

                ALTER TABLE ventas
                    ADD COLUMN IF NOT EXISTS clase VARCHAR(50);

                ALTER TABLE ventas
                    ADD COLUMN IF NOT EXISTS uso VARCHAR(50);
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
    const normalized = normalizarPlaca(placa);
    const clean = normalized.replace(/[^A-Z0-9]/g, '');

    if (usePostgres && pool) {
        try {
            const res = await pool.query(
                `SELECT * FROM vehiculos
                 WHERE REGEXP_REPLACE(UPPER(placa), '[^A-Z0-9]', '', 'g') = $1
                 LIMIT 1`,
                [clean]
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
    const vehicles = db.vehiculos || {};
    return vehicles[normalized] || vehicles[clean] ||
        Object.values(vehicles).find(vehicle => normalizarPlaca(vehicle.placa) === normalized) || null;
}

async function guardarVehiculo(v) {
    if (!v || !v.placa) return false;
    const placa = normalizarPlaca(v.placa);
    const clean = placa.replace(/[^A-Z0-9]/g, '');

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
                placa, v.clase || 'AUTO', v.marca || '', v.modelo || '', v.modeloEsp || '',
                v.serie || '', v.anio || '', String(v.asientos || '5'), v.uso || 'PARTICULAR',
                v.categoria || 'M1', v.version || 'STD', v.zona || 'TACNA', v.monto || ''
            ]);
            return true;
        } catch (e) {
            console.error('[DB] Error guardando vehículo en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    if (!db.vehiculos) db.vehiculos = {};
    const normalizedVehicle = { ...v, placa };
    db.vehiculos[placa] = normalizedVehicle;
    db.vehiculos[clean] = normalizedVehicle;
    guardarBaseLocal(db);
    return true;
}

// -------------------------------------------------------------
// OPERACIONES DE VENTAS / EMISIÓN
// -------------------------------------------------------------
async function registrarVenta(venta) {
    if (!venta.placa || !venta.numeroPoliza) return null;
    const placa = normalizarPlaca(venta.placa);

    if (usePostgres && pool) {
        try {
            const res = await pool.query(`
                INSERT INTO ventas (placa, numero_poliza, clase, uso, contratante_nombre, contratante_documento, monto, forma_pago)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `, [
                placa, venta.numeroPoliza, venta.clase, venta.uso, venta.contratanteNombre,
                venta.contratanteDocumento, venta.monto, venta.formaPago
            ]);
            return res.rows[0];
        } catch (e) {
            console.error('[DB] Error registrando venta en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    const nuevaVenta = {
        id: db.ventas.length + 1,
        placa,
        numero_poliza: venta.numeroPoliza,
        clase: venta.clase,
        uso: venta.uso,
        contratante_nombre: venta.contratanteNombre,
        contratante_documento: venta.contratanteDocumento,
        monto: venta.monto,
        forma_pago: venta.formaPago,
        emitido_en: new Date().toISOString()
    };
    db.ventas.push(nuevaVenta);
    guardarBaseLocal(db);
    return nuevaVenta;
}

async function listarVentas() {
    if (usePostgres && pool) {
        try {
            const res = await pool.query('SELECT * FROM ventas ORDER BY emitido_en DESC');
            return res.rows;
        } catch (e) {
            console.error('[DB] Error listando ventas en Postgres:', e.message);
        }
    }
    const db = cargarBaseLocal();
    return [...db.ventas].reverse();
}

async function eliminarVenta(id) {
    if (!Number.isSafeInteger(id) || id <= 0) return false;

    if (usePostgres && pool) {
        try {
            const res = await pool.query('DELETE FROM ventas WHERE id = $1 RETURNING id', [id]);
            return res.rowCount > 0;
        } catch (e) {
            console.error('[DB] Error eliminando venta en Postgres:', e.message);
            throw e;
        }
    }

    const db = cargarBaseLocal();
    const ventas = Array.isArray(db.ventas) ? db.ventas : [];
    const ventasActualizadas = ventas.filter(venta => Number(venta.id) !== id);
    if (ventasActualizadas.length === ventas.length) return false;

    db.ventas = ventasActualizadas;
    if (!guardarBaseLocal(db)) throw new Error('No se pudo eliminar la venta localmente.');
    return true;
}

async function buscarVentasPorPlaca(placa) {
    const clean = normalizarPlaca(placa).replace(/[^A-Z0-9]/g, '');
    if (!clean) return [];

    if (usePostgres && pool) {
        try {
            const res = await pool.query(
                `SELECT * FROM ventas
                 WHERE REGEXP_REPLACE(UPPER(placa), '[^A-Z0-9]', '', 'g') = $1
                 ORDER BY emitido_en DESC`,
                [clean]
            );
            return res.rows;
        } catch (e) {
            console.error('[DB] Error buscando ventas en Postgres:', e.message);
        }
    }

    const db = cargarBaseLocal();
    return db.ventas
        .filter(v => String(v.placa || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase() === clean)
        .sort((a, b) => new Date(b.emitido_en) - new Date(a.emitido_en));
}

async function registrarRegistroApeseg(registro) {
    if (!registro.placa || !registro.clase || !registro.compania || !registro.numeroPoliza ||
        !registro.estado || !registro.fechaCreacion || !registro.fechaInicio || !registro.fechaFin ||
        !['DIGITAL', 'FISICO'].includes(registro.tipoSoat)) {
        return null;
    }
    const placa = normalizarPlaca(registro.placa);

    if (usePostgres && pool) {
        try {
            const res = await pool.query(`
                INSERT INTO registros_apeseg (placa, clase, compania, numero_poliza, estado, fecha_inicio, fecha_fin, tipo_soat, creado_en)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::date + TIME '12:00:00')
                RETURNING *
            `, [
                placa, registro.clase, registro.compania, registro.numeroPoliza,
                registro.estado, registro.fechaInicio, registro.fechaFin,
                registro.tipoSoat, registro.fechaCreacion
            ]);
            return res.rows[0];
        } catch (e) {
            console.error('[DB] Error registrando certificado APESEG en Postgres:', e.message);
            throw e;
        }
    }

    const db = cargarBaseLocal();
    if (!Array.isArray(db.registrosApeseg)) db.registrosApeseg = [];
    const nuevoRegistro = {
        id: db.registrosApeseg.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1,
        placa,
        clase: registro.clase,
        compania: registro.compania,
        numero_poliza: registro.numeroPoliza,
        estado: registro.estado,
        fecha_inicio: registro.fechaInicio,
        fecha_fin: registro.fechaFin,
        tipo_soat: registro.tipoSoat,
        creado_en: `${registro.fechaCreacion}T12:00:00.000Z`
    };
    db.registrosApeseg.push(nuevoRegistro);
    if (!guardarBaseLocal(db)) throw new Error('No se pudo guardar el registro APESEG localmente.');
    return nuevoRegistro;
}

async function listarRegistrosApeseg() {
    if (usePostgres && pool) {
        try {
            const res = await pool.query('SELECT * FROM registros_apeseg ORDER BY creado_en DESC');
            return res.rows;
        } catch (e) {
            console.error('[DB] Error listando registros APESEG en Postgres:', e.message);
            throw e;
        }
    }

    const db = cargarBaseLocal();
    return [...(db.registrosApeseg || [])].reverse();
}

async function eliminarRegistroApeseg(id) {
    if (!Number.isSafeInteger(id) || id <= 0) return false;

    if (usePostgres && pool) {
        try {
            const res = await pool.query('DELETE FROM registros_apeseg WHERE id = $1 RETURNING id', [id]);
            return res.rowCount > 0;
        } catch (e) {
            console.error('[DB] Error eliminando registro APESEG en Postgres:', e.message);
            throw e;
        }
    }

    const db = cargarBaseLocal();
    const registros = Array.isArray(db.registrosApeseg) ? db.registrosApeseg : [];
    const registrosActualizados = registros.filter(registro => Number(registro.id) !== id);
    if (registrosActualizados.length === registros.length) return false;

    db.registrosApeseg = registrosActualizados;
    if (!guardarBaseLocal(db)) throw new Error('No se pudo eliminar el registro APESEG localmente.');
    return true;
}

module.exports = {
    normalizarPlaca,
    initDB,
    autenticarUsuario,
    crearSesion,
    validarSesion,
    destruirSesion,
    obtenerVehiculo,
    guardarVehiculo,
    registrarVenta,
    listarVentas,
    eliminarVenta,
    buscarVentasPorPlaca,
    registrarRegistroApeseg,
    listarRegistrosApeseg,
    eliminarRegistroApeseg,
    cargarBaseLocal
};
