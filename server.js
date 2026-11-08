const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const BASE_DIR = __dirname;
const ENV_FILE = path.join(BASE_DIR, '.env');
const DB = require('./db');
const captchaChallenges = new Map();
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Cargar variables desde archivo .env y process.env
function leerConfig() {
    const cfg = {
        puerto: 3000,
        tokenYupay: process.env.YUPAY_TOKEN || '',
        cookieLaPositiva: process.env.LAPOSITIVA_COOKIE || '',
        databaseUrl: process.env.DATABASE_URL || '',
        apiKey: process.env.API_KEY || '',
        sunarpApiKey: process.env.SUNARP_API_KEY || '',
        reniecApiHost: process.env.RENIEC_API_HOST || 'soat-rec.stkkft.easypanel.host',
        adminUser: process.env.ADMIN_USER || '',
        adminPassword: process.env.ADMIN_PASSWORD || '',
        adminNombre: process.env.ADMIN_NOMBRE || 'Administrador',
        adminAgencia: process.env.ADMIN_AGENCIA || 'Agencia Principal',
        timeoutMs: 10000
    };

    try {
        if (fs.existsSync(ENV_FILE)) {
            const lines = fs.readFileSync(ENV_FILE, 'utf-8').split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx === -1) continue;
                const key = trimmed.substring(0, eqIdx).trim();
                let val = trimmed.substring(eqIdx + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                if (key === 'PORT' || key === 'PUERTO') cfg.puerto = parseInt(val, 10) || 3000;
                if (key === 'YUPAY_TOKEN' || key === 'TOKEN_YUPAY') cfg.tokenYupay = val;
                if (key === 'LAPOSITIVA_COOKIE' || key === 'COOKIE_LAPOSITIVA') cfg.cookieLaPositiva = val;
                if (key === 'DATABASE_URL' || key === 'POSTGRES_URL') cfg.databaseUrl = val;
                if (key === 'API_KEY') cfg.apiKey = val;
                if (key === 'SUNARP_API_KEY' && !process.env.SUNARP_API_KEY) cfg.sunarpApiKey = val;
                if (key === 'RENIEC_API_HOST') cfg.reniecApiHost = val;
                if (key === 'ADMIN_USER') cfg.adminUser = val;
                if (key === 'ADMIN_PASSWORD') cfg.adminPassword = val;
                if (key === 'ADMIN_NOMBRE') cfg.adminNombre = val;
                if (key === 'ADMIN_AGENCIA') cfg.adminAgencia = val;
                if (key === 'TIMEOUT_MS') cfg.timeoutMs = parseInt(val, 10) || 10000;
            }
        }
    } catch (e) {
        console.error('[ENV] Error leyendo archivo .env:', e.message);
    }

    if (!cfg.sunarpApiKey) cfg.sunarpApiKey = cfg.apiKey;

    return cfg;
}

function guardarConfig(cfg) {
    try {
        let current = '';
        if (fs.existsSync(ENV_FILE)) {
            current = fs.readFileSync(ENV_FILE, 'utf-8');
        } else {
            current = '# Configuración del Sistema SOAT La Positiva Local\nPORT=3000\nYUPAY_TOKEN=\nLAPOSITIVA_COOKIE=\nDATABASE_URL=\nSUNARP_API_KEY=\nTIMEOUT_MS=10000\n';
        }

        const updateKey = (text, key, val) => {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(text)) {
                return text.replace(regex, `${key}=${val}`);
            } else {
                return text + (text && !text.endsWith('\n') ? '\n' : '') + `${key}=${val}\n`;
            }
        };

        let updated = current;
        if (cfg.puerto !== undefined) updated = updateKey(updated, 'PORT', cfg.puerto);
        if (cfg.tokenYupay !== undefined) updated = updateKey(updated, 'YUPAY_TOKEN', cfg.tokenYupay);
        if (cfg.cookieLaPositiva !== undefined) updated = updateKey(updated, 'LAPOSITIVA_COOKIE', cfg.cookieLaPositiva);
        if (cfg.databaseUrl !== undefined) updated = updateKey(updated, 'DATABASE_URL', cfg.databaseUrl);
        if (cfg.timeoutMs !== undefined) updated = updateKey(updated, 'TIMEOUT_MS', cfg.timeoutMs);

        fs.writeFileSync(ENV_FILE, updated, 'utf-8');
        console.log('[ENV] Archivo .env actualizado correctamente.');
        return true;
    } catch (e) {
        console.error('[ENV] Error guardando archivo .env:', e.message);
        return false;
    }
}

// Helper para parsear cookies de la solicitud
function parsearCookies(req) {
    const list = {};
    const rc = req.headers.cookie;
    if (rc) {
        rc.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    return list;
}

// Mapa de tipos MIME
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const PUBLIC_ROOT_FILES = new Set([
    'admin.html',
    'apeseg-interna.html',
    'apeseg.html',
    'cotizacion.html',
    'dashboard.html',
    'index.html',
    'index_original.html',
    'ventas.html',
    'favicon.ico'
]);
const PUBLIC_STATIC_DIRECTORIES = new Set([
    'apeseg',
    'assets',
    'content',
    'external',
    'fonts',
    'images',
    'scripts'
]);

function normalizarPlaca(p) {
    return DB.normalizarPlaca(p);
}

function validarDatosRegistroApeseg(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

    const placa = normalizarPlaca(typeof data.placa === 'string' ? data.placa.trim() : '');
    const compania = typeof data.compania === 'string' ? data.compania.trim() : '';
    const numeroPoliza = typeof data.numeroPoliza === 'string' ? data.numeroPoliza.trim() : '';
    const clase = typeof data.clase === 'string' ? data.clase.trim() : '';
    const estado = typeof data.estado === 'string' ? data.estado.trim().toUpperCase() : '';
    const tipoSoat = typeof data.tipoSoat === 'string' ? data.tipoSoat.trim().toUpperCase() : '';
    const costoValue = typeof data.costo === 'string' ? data.costo.trim() : String(data.costo ?? '');
    const costo = Number(costoValue);
    const fechaCreacion = typeof data.fechaCreacion === 'string' ? data.fechaCreacion : '';
    const fechaInicio = typeof data.fechaInicio === 'string' ? data.fechaInicio : '';
    const fechaFin = typeof data.fechaFin === 'string' ? data.fechaFin : '';
    const placaLimpia = placa.replace(/[^A-Z0-9]/g, '');
    const fechaValida = value =>
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
        new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
    const estadosValidos = ['VIGENTE', 'VENCIDO', 'AUN_NO_VIGENTE', 'ANULADO'];

    if (placaLimpia.length < 6 || placaLimpia.length > 9 ||
        !compania || compania.length > 100 ||
        !numeroPoliza || numeroPoliza.length > 100 ||
        !clase || clase.length > 50 ||
        !/^\d{1,8}(?:\.\d{1,2})?$/.test(costoValue) ||
        !Number.isFinite(costo) || costo < 0 ||
        !['DIGITAL', 'FISICO'].includes(tipoSoat) ||
        !estadosValidos.includes(estado) ||
        !fechaValida(fechaCreacion) || !fechaValida(fechaInicio) ||
        !fechaValida(fechaFin) || fechaInicio > fechaFin) {
        return null;
    }

    return {
        placa,
        clase,
        compania,
        numeroPoliza,
        estado,
        tipoSoat,
        costo,
        fechaCreacion,
        fechaInicio,
        fechaFin
    };
}

function esPlacaMoto(p) {
    if (!p) return false;
    const clean = p.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (/^\d{4}[A-Z0-9]{2}$/.test(clean)) return true;
    if (/^\d{3}[A-Z0-9]{2}$/.test(clean)) return true;
    return false;
}

function detectarZonaPorPlaca(p) {
    if (!p) return "TACNA";
    const clean = p.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const l1 = clean.charAt(0);
    const zonas = {
        'Z': 'TACNA', 'V': 'AREQUIPA', 'X': 'CUSCO', 'Y': 'PUNO',
        'A': 'LIMA', 'B': 'LIMA', 'C': 'LIMA', 'D': 'LIMA', 'F': 'LIMA',
        'P': 'PIURA', 'M': 'LAMBAYEQUE', 'T': 'LA LIBERTAD', 'H': 'ANCASH',
        'W': 'JUNIN', 'S': 'ICA'
    };
    return zonas[l1] || "TACNA";
}

// Consulta a Yupay.dev (SUNARP en vivo)
function consultarYupay(placa, token, timeoutMs) {
    return new Promise((resolve, reject) => {
        const clean = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        const options = {
            hostname: 'api.yupay.dev',
            port: 443,
            path: `/v1/plate/${encodeURIComponent(clean)}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.trim()}`,
                'Accept': 'application/json',
                'User-Agent': 'PositivaSOAT/1.0'
            },
            timeout: timeoutMs || 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, data: json });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, raw: data });
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('TIMEOUT_YUPAY'));
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

function consultarReniec(dni, apiKey, timeoutMs, host) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ dni });
        const req = https.request({
            hostname: host,
            port: 443,
            path: '/reniec/consulta',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'X-API-Key': apiKey,
                'Accept': 'application/json'
            },
            timeout: timeoutMs || 10000
        }, response => {
            let responseBody = '';
            let responseTooLarge = false;
            response.on('data', chunk => {
                responseBody += chunk;
                if (Buffer.byteLength(responseBody, 'utf8') > 1024 * 1024) {
                    responseTooLarge = true;
                    response.destroy();
                }
            });
            response.on('end', () => {
                if (responseTooLarge) {
                    reject(new Error('RESPONSE_TOO_LARGE'));
                    return;
                }
                try {
                    resolve({ statusCode: response.statusCode, data: JSON.parse(responseBody) });
                } catch {
                    reject(new Error('INVALID_RENIEC_RESPONSE'));
                }
            });
            response.on('error', error => reject(error));
        });

        req.on('timeout', () => {
            req.destroy(new Error('TIMEOUT_RENIEC'));
        });
        req.on('error', error => reject(error));
        req.end(body);
    });
}

function consultarSunarp(placa, apiKey, timeoutMs) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ placa });
        const req = https.request({
            hostname: 'soat-rec.stkkft.easypanel.host',
            port: 443,
            path: '/sunarp/consulta',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'X-API-Key': apiKey,
                'Accept': 'application/json'
            },
            timeout: timeoutMs || 10000
        }, response => {
            let responseBody = '';
            let responseTooLarge = false;
            response.on('data', chunk => {
                responseBody += chunk;
                if (Buffer.byteLength(responseBody, 'utf8') > 1024 * 1024) {
                    responseTooLarge = true;
                    response.destroy();
                }
            });
            response.on('end', () => {
                if (responseTooLarge) {
                    reject(new Error('RESPONSE_TOO_LARGE'));
                    return;
                }
                try {
                    resolve({ statusCode: response.statusCode, data: JSON.parse(responseBody) });
                } catch {
                    resolve({ statusCode: response.statusCode, raw: responseBody });
                }
            });
            response.on('error', error => reject(error));
        });

        req.on('timeout', () => {
            req.destroy(new Error('TIMEOUT_SUNARP'));
        });
        req.on('error', error => reject(error));
        req.end(body);
    });
}

// Páginas protegidas que requieren sesión activa
const PAGINAS_PROTEGIDAS = [
    '/ventas.html',
    '/ventas',
    '/dashboard.html',
    '/dashboard',
    '/cotizacion.html',
    '/cotizacion'
];

// Servidor principal
const server = http.createServer(async (req, res) => {
    // Headers CORS globales
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    const cookies = parsearCookies(req);
    const sessionToken = cookies['soat_session'] || req.headers['authorization']?.replace('Bearer ', '');

    // ==========================================
    // 0. CONTROL DE AUTENTICACIÓN (LOGIN OBLIGATORIO)
    // ==========================================
    const esPaginaProtegida = PAGINAS_PROTEGIDAS.includes(pathname.toLowerCase());
    if (esPaginaProtegida) {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            console.log(`[AUTH] Intento de acceso no autorizado a ${pathname}. Redirigiendo a /index.html`);
            res.writeHead(302, { 'Location': '/index.html' });
            res.end();
            return;
        }
    }

    // ==========================================
    // 1. ENDPOINT: /api/login (Autenticación contra Base de Datos)
    // ==========================================
    if (pathname === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const usuario = data.username || data.Usuario || '';
                const password = data.password || data.Password || '';

                const userAutenticado = await DB.autenticarUsuario(usuario, password);

                if (userAutenticado) {
                    const token = await DB.crearSesion(userAutenticado);
                    console.log(`[AUTH] Inicio de sesión exitoso: ${userAutenticado.username} (${userAutenticado.nombreCompleto})`);

                    // Establecer cookie HttpOnly de sesión
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `soat_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
                    });
                    res.end(JSON.stringify({
                        success: true,
                        mensaje: 'Bienvenido al sistema SOAT.',
                        redirect: 'ventas.html',
                        token: token,
                        user: userAutenticado
                    }));
                } else {
                    console.log(`[AUTH] Falló inicio de sesión para: "${usuario}"`);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        mensaje: 'Usuario o contraseña incorrectos.'
                    }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, mensaje: 'Datos inválidos.' }));
            }
        });
        return;
    }

    // ==========================================
    // 2. ENDPOINT: /api/logout (Cerrar sesión)
    // ==========================================
    if ((pathname === '/api/logout' || pathname === '/Home/CerrarSesion') && (req.method === 'POST' || req.method === 'GET')) {
        await DB.destruirSesion(sessionToken);
        console.log('[AUTH] Sesión cerrada.');
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': 'soat_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        });
        res.end(JSON.stringify({ success: true, redirect: 'index.html' }));
        return;
    }

    // ==========================================
    // 3. ENDPOINT: /api/session (Validar sesión activa)
    // ==========================================
    if (pathname === '/api/session') {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (sesionValida) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: true, user: sesionValida }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ authenticated: false }));
        }
        return;
    }

    // ==========================================
    // 3.1 ENDPOINT: Imagen de captcha para consulta SOAT
    // ==========================================
    if (pathname === '/api/captcha' && req.method === 'GET') {
        const now = Date.now();
        for (const [id, challenge] of captchaChallenges) {
            if (challenge.expiresAt <= now) captchaChallenges.delete(id);
        }

        const id = crypto.randomBytes(24).toString('hex');
        let answer = '';
        for (let i = 0; i < 5; i++) {
            answer += CAPTCHA_ALPHABET[crypto.randomInt(CAPTCHA_ALPHABET.length)];
        }
        captchaChallenges.set(id, { answer, expiresAt: now + CAPTCHA_TTL_MS });

        const characters = [...answer].map((character, index) => {
            const x = 14 + index * 25.5;
            const y = 29 + crypto.randomInt(-2, 3);
            const rotation = crypto.randomInt(-11, 12);
            return `<text x="${x}" y="${y}" transform="rotate(${rotation} ${x} ${y})">${character}</text>`;
        }).join('');
        const lines = Array.from({ length: 3 }, () => {
            const x1 = crypto.randomInt(0, 131);
            const y1 = crypto.randomInt(0, 44);
            const x2 = crypto.randomInt(0, 131);
            const y2 = crypto.randomInt(0, 44);
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        }).join('');
        const image = `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="43" viewBox="0 0 130 43"><rect width="130" height="43" rx="8" fill="#f0f0f0"/><g stroke="#b7adcc" stroke-width="0.8" opacity="0.55">${lines}</g><g fill="#3f2389" font-family="Arial,sans-serif" font-size="22" font-weight="700">${characters}</g></svg>`;

        res.writeHead(200, {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Set-Cookie': `soat_captcha=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`
        });
        res.end(image);
        return;
    }

    if (pathname === '/api/reniec/consulta' && req.method === 'POST') {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Debe iniciar sesión para consultar un DNI.' }));
            return;
        }

        let body = '';
        try {
            for await (const chunk of req) {
                body += chunk;
                if (Buffer.byteLength(body, 'utf8') > 1024) {
                    res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Solicitud demasiado grande.' }));
                    return;
                }
            }
        } catch (error) {
            console.error('[RENIEC] Error leyendo solicitud:', error.message);
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'No se pudo leer la solicitud.' }));
            return;
        }

        let data;
        try {
            data = JSON.parse(body);
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Solicitud inválida.' }));
            return;
        }

        const dni = typeof data.dni === 'string' ? data.dni.trim() : '';
        if (!/^\d{8}$/.test(dni)) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'El DNI debe tener exactamente 8 dígitos.' }));
            return;
        }

        const config = leerConfig();
        if (!config.apiKey) {
            res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'No está configurada la clave de consulta RENIEC (API_KEY).' }));
            return;
        }

        try {
            const resultado = await consultarReniec(
                dni, config.apiKey, config.timeoutMs, config.reniecApiHost
            );
            if (resultado.statusCode < 200 || resultado.statusCode >= 300) {
                const message = resultado.data && (resultado.data.message || resultado.data.error);
                const status = resultado.statusCode === 404 ? 404 : 502;
                res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    error: typeof message === 'string'
                        ? message
                        : (status === 404 ? 'No se encontró información para ese DNI.' : 'La consulta RENIEC no pudo completarse.')
                }));
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store'
            });
            res.end(JSON.stringify(resultado.data));
        } catch (error) {
            const timedOut = error.message === 'TIMEOUT_RENIEC';
            console.error('[RENIEC] Error consultando DNI:', error.message);
            res.writeHead(timedOut ? 504 : 502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                error: timedOut ? 'La consulta RENIEC tardó demasiado. Inténtalo nuevamente.' : 'No se pudo consultar RENIEC.'
            }));
        }
        return;
    }

    if (pathname === '/api/consulta' && req.method === 'POST') {
        let body = '';
        let bodyTooLarge = false;
        req.on('data', chunk => {
            if (body.length + chunk.length > 4096) {
                bodyTooLarge = true;
                return;
            }
            body += chunk;
        });
        req.on('end', async () => {
            if (bodyTooLarge) {
                res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Solicitud demasiado grande.' }));
                return;
            }

            let data;
            try {
                data = JSON.parse(body);
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Solicitud inválida.' }));
                return;
            }

            const captchaId = cookies.soat_captcha;
            const challenge = captchaId && captchaChallenges.get(captchaId);
            if (captchaId) captchaChallenges.delete(captchaId);
            if (!challenge || challenge.expiresAt <= Date.now() ||
                !data || typeof data.captcha !== 'string' ||
                data.captcha.trim().toUpperCase() !== challenge.answer) {
                res.writeHead(400, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Set-Cookie': 'soat_captcha=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
                });
                res.end(JSON.stringify({ message: 'Captcha incorrecto o vencido. Inténtalo nuevamente.' }));
                return;
            }

            try {
                const placa = normalizarPlaca(data.plate || '');
                const [ventas, registrosApeseg] = placa
                    ? await Promise.all([
                        DB.buscarVentasPorPlaca(placa),
                        DB.listarRegistrosApeseg()
                    ])
                    : [[], []];
                const cleanPlate = placa.replace(/[^A-Z0-9]/g, '');
                const registrosDePlaca = registrosApeseg.filter(registro =>
                    String(registro.placa || '').replace(/[^A-Z0-9]/gi, '').toUpperCase() === cleanPlate
                );
                if (!ventas.length && !registrosDePlaca.length) {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ data: { found: false, plate: placa } }));
                    return;
                }

                const vehiculo = (await DB.obtenerVehiculo(placa)) || {};
                const finDe = fecha => {
                    const d = new Date(fecha);
                    d.setFullYear(d.getFullYear() + 1);
                    return d;
                };
                const soloFecha = value => {
                    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
                    const date = new Date(value);
                    if (Number.isNaN(date.getTime())) return '';
                    return new Intl.DateTimeFormat('en-CA', {
                        timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit'
                    }).format(date);
                };
                const estadoPorVigencia = (inicio, fin, estado) => {
                    if (String(estado || '').toUpperCase() === 'ANULADO') return 'ANULADO';
                    const hoy = soloFecha(new Date());
                    if (inicio > hoy) return 'AUN_NO_VIGENTE';
                    if (fin <= hoy) return 'VENCIDO';
                    return 'VIGENTE';
                };
                const historial = [
                    ...ventas.map(venta => {
                        const inicio = soloFecha(venta.emitido_en);
                        const fin = soloFecha(finDe(venta.emitido_en));
                        return {
                            insurer: 'LA POSITIVA SEGUROS Y REASEGUROS',
                            policyNumber: venta.numero_poliza,
                            plate: normalizarPlaca(venta.placa || placa),
                            startsAt: inicio,
                            expiresAt: fin,
                            status: estadoPorVigencia(inicio, fin),
                            vehicleUse: vehiculo.uso || 'PARTICULAR',
                            vehicleClass: vehiculo.clase || venta.clase || '',
                            certificateType: 'DIGITAL',
                            createdAt: new Date(venta.emitido_en).toISOString(),
                            cancelledAt: null,
                            policeCheckAt: null,
                            seats: vehiculo.asientos || '',
                            vehicleModel: vehiculo.modeloEsp || vehiculo.modelo || '',
                            make: vehiculo.marca || ''
                        };
                    }),
                    ...registrosDePlaca.map(registro => {
                        const inicio = soloFecha(registro.fecha_inicio);
                        const fin = soloFecha(registro.fecha_fin);
                        return {
                            insurer: registro.compania,
                            policyNumber: registro.numero_poliza,
                            plate: normalizarPlaca(registro.placa || placa),
                            startsAt: inicio,
                            expiresAt: fin,
                            status: estadoPorVigencia(inicio, fin, registro.estado),
                            vehicleUse: vehiculo.uso || 'PARTICULAR',
                            vehicleClass: vehiculo.clase || registro.clase || '',
                            certificateType: ['DIGITAL', 'FISICO'].includes(String(registro.tipo_soat || '').toUpperCase())
                                ? String(registro.tipo_soat).toUpperCase()
                                : 'DIGITAL',
                            createdAt: registro.creado_en ? soloFecha(registro.creado_en) : null,
                            cancelledAt: null,
                            policeCheckAt: null,
                            seats: vehiculo.asientos || '',
                            vehicleModel: vehiculo.modeloEsp || vehiculo.modelo || '',
                            make: vehiculo.marca || ''
                        };
                    })
                ].sort((a, b) => b.startsAt.localeCompare(a.startsAt));
                const actual = historial[0];
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    data: {
                        found: true,
                        ...actual,
                        history: historial
                    }
                }));
            } catch (e) {
                console.error('[CONSULTA SOAT] Error:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'No se pudo completar la consulta.' }));
            }
        });
        return;
    }

    if (pathname === '/api/sunarp/consulta' && req.method === 'POST') {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                code: 'SESSION_REQUIRED',
                error: 'Debe iniciar sesión para consultar una placa.'
            }));
            return;
        }

        let body = '';
        try {
            for await (const chunk of req) {
                body += chunk;
                if (Buffer.byteLength(body, 'utf8') > 1024) {
                    res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Solicitud demasiado grande.' }));
                    return;
                }
            }
        } catch (error) {
            console.error('[SUNARP] Error leyendo solicitud:', error.message);
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'No se pudo leer la solicitud.' }));
            return;
        }

        let data;
        try {
            data = JSON.parse(body);
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Solicitud inválida.' }));
            return;
        }

        const placa = typeof data.placa === 'string'
            ? data.placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
            : '';
        if (!placa || placa.length > 10) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Ingrese una placa válida.' }));
            return;
        }

        const config = leerConfig();
        if (!config.sunarpApiKey) {
            res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'No está configurada la clave API_KEY o SUNARP_API_KEY en el backend.' }));
            return;
        }

        try {
            const resultado = await consultarSunarp(placa, config.sunarpApiKey, config.timeoutMs);
            const status = resultado.statusCode || 502;
            if (status < 200 || status >= 300) {
                const message = resultado.data && (resultado.data.message || resultado.data.error);
                res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    error: typeof message === 'string'
                        ? message
                        : (typeof resultado.raw === 'string' && resultado.raw
                            ? resultado.raw.slice(0, 500)
                            : 'La consulta SUNARP no pudo completarse.')
                }));
                return;
            }

            if (!resultado.data) {
                res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'SUNARP devolvió una respuesta inválida.' }));
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store'
            });
            res.end(JSON.stringify(resultado.data));
        } catch (error) {
            const timedOut = error.message === 'TIMEOUT_SUNARP';
            console.error('[SUNARP] Error consultando placa:', error.message);
            res.writeHead(timedOut ? 504 : 502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                error: timedOut
                    ? 'La consulta SUNARP tardó demasiado. Inténtalo nuevamente.'
                    : 'No se pudo conectar con SUNARP.'
            }));
        }
        return;
    }

    // ==========================================
    // 4. ENDPOINT: /Ventas/ObtenerInformacionPlaca
    // ==========================================
    if (pathname === '/Ventas/ObtenerInformacionPlaca' || pathname === '/api/consultar-placa') {
        const qPlaca = parsedUrl.query.pPlaca || parsedUrl.query.placa || '';
        const placaNorm = normalizarPlaca(qPlaca);
        const config = leerConfig();
        const esMoto = esPlacaMoto(placaNorm);
        const zonaDetectada = detectarZonaPorPlaca(placaNorm);

        console.log(`\n[PROXY] >>> Solicitud de placa: "${qPlaca}" (Normalizada: "${placaNorm}")`);

        // A. Consulta a YUPAY.DEV (SUNARP en vivo)
        if (config.tokenYupay && config.tokenYupay.trim().length > 5) {
            console.log('[PROXY] Consultando en vivo a Yupay.dev (SUNARP)...');
            try {
                const resYupay = await consultarYupay(placaNorm, config.tokenYupay, config.timeoutMs);
                if (resYupay.statusCode === 200 && resYupay.data) {
                    const y = resYupay.data;
                    const vehY = y.vehiculo || y.data || y;

                    const marcaY = vehY.marca || y.marca || "";
                    const modeloY = vehY.modelo || y.modelo || "";
                    const serieY = vehY.numSerie || vehY.serie || vehY.vin || vehY.numeroSerie || y.numSerie || y.serie || y.vin || "";
                    const motorY = vehY.numMotor || vehY.numeroMotor || vehY.motor || y.numMotor || "";
                    const anioY = String(vehY.anioFabricacion || vehY.anio || vehY.año || y.anioFabricacion || y.anio || y.año || "");
                    const asientosY = String(vehY.numAsientos || vehY.asientos || vehY.numeroAsiento || y.numAsientos || (esMoto ? "2" : "5"));
                    const claseY = vehY.clase || (esMoto ? "MOTO" : "AUTO");
                    const tipoY = vehY.tipo || "";
                    const categoriaY = vehY.categoria || (esMoto ? "L3" : "M1");
                    const usoY = vehY.uso || "PARTICULAR";
                    const colorY = vehY.color || "";
                    const modeloEspY = tipoY || (colorY ? colorY + " " : "") + (vehY.carroceria || "STD");

                    if (marcaY || serieY || modeloY) {
                        console.log(`[PROXY] ¡Datos obtenidos de SUNARP vía Yupay.dev!: ${marcaY} ${modeloY} (${anioY}) Motor: ${motorY} Serie: ${serieY}`);

                        const vehiculoConstruido = {
                            placa: placaNorm,
                            clase: claseY,
                            marca: marcaY,
                            modelo: modeloY,
                            modeloEsp: modeloEspY,
                            serie: serieY,
                            anio: anioY,
                            asientos: asientosY,
                            uso: usoY,
                            categoria: categoriaY,
                            version: "STD",
                            zona: zonaDetectada,
                            formaPago: "Efectivo",
                            moneda: "Soles",
                            monto: esMoto ? "S/ 140.00" : "S/ 65.00",
                            motor: motorY,
                            color: colorY
                        };

                        // Auto-guardar en base de datos
                        await DB.guardarVehiculo(vehiculoConstruido);

                        const respuestaPositiva = {
                            IsValid: true,
                            Valid: true,
                            estado: "OK",
                            resultado: {
                                CertificadosDTO: [{
                                    VehiculoDTO: {
                                        Placa: placaNorm,
                                        DescripcionClase: claseY,
                                        DescripcionMarca: marcaY,
                                        DescripcionModelo: modeloY,
                                        ModeloEspecifico: modeloEspY,
                                        NumeroSerie: serieY,
                                        NumeroMotor: motorY,
                                        Anio: anioY,
                                        NumeroAsiento: asientosY,
                                        DescripcionUso: usoY,
                                        DescripcionCategoria: categoriaY,
                                        DescripcionVersion: "STD",
                                        DescripcionZona: zonaDetectada
                                    }
                                }]
                            },
                            VehiculoDTO: vehiculoConstruido,
                            origen: "YUPAY_SUNARP"
                        };

                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(respuestaPositiva));
                        return;
                    }
                } else {
                    console.log(`[PROXY] Yupay respondió ${resYupay.statusCode}:`, resYupay.data?.error?.message || JSON.stringify(resYupay.data || ''));
                }
            } catch (errY) {
                console.log('[PROXY] Error consultando Yupay.dev:', errY.message);
            }
        }

        // B. Búsqueda en Base de Datos (PostgreSQL o Local)
        const vehiculoLocal = await DB.obtenerVehiculo(placaNorm);
        if (vehiculoLocal) {
            console.log(`[PROXY] ¡Vehículo encontrado en Base de Datos!: ${vehiculoLocal.marca} ${vehiculoLocal.modelo}`);

            const respuestaEstandar = {
                IsValid: true,
                Valid: true,
                estado: "OK",
                resultado: {
                    CertificadosDTO: [{
                        VehiculoDTO: {
                            Placa: vehiculoLocal.placa,
                            DescripcionClase: vehiculoLocal.clase,
                            DescripcionMarca: vehiculoLocal.marca,
                            DescripcionModelo: vehiculoLocal.modelo,
                            ModeloEspecifico: vehiculoLocal.modeloEsp || "",
                            NumeroSerie: vehiculoLocal.serie || "",
                            Anio: vehiculoLocal.anio || "",
                            NumeroAsiento: vehiculoLocal.asientos || "5",
                            DescripcionUso: vehiculoLocal.uso || "PARTICULAR",
                            DescripcionCategoria: vehiculoLocal.categoria || "M1",
                            DescripcionVersion: vehiculoLocal.version || "STD",
                            DescripcionZona: vehiculoLocal.zona || zonaDetectada
                        }
                    }]
                },
                VehiculoDTO: vehiculoLocal,
                origen: "BASE_DE_DATOS"
            };

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(respuestaEstandar));
            return;
        }

        // C. No encontrado
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            IsValid: true,
            Valid: true,
            estado: "NO_ENCONTRADO",
            placa: placaNorm,
            mensaje: "Placa no encontrada. Ingrese los datos manualmente para guardarla.",
            origen: "NINGUNO"
        }));
        return;
    }

    // ==========================================
    // 5. ENDPOINT: Guardar vehículo
    // ==========================================
    if (pathname === '/api/guardar-vehiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const veh = JSON.parse(body);
                const ok = await DB.guardarVehiculo(veh);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: ok }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // ==========================================
    // 5.1 ENDPOINT: Emitir SOAT
    // ==========================================
    if (pathname === '/api/emitir-soat' && req.method === 'POST') {
        const sesionValida = await DB.validarSesion(sessionToken);
        const usuarioId = sesionValida ? (sesionValida.userId || sesionValida.id) : null;

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const venta = JSON.parse(body);
                venta.uso = typeof venta.uso === 'string' ? venta.uso.trim().toUpperCase() : '';
                if (!['PARTICULAR', 'PUBLICO', 'COMERCIAL'].includes(venta.uso)) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'El uso debe ser PARTICULAR, PUBLICO o COMERCIAL.' }));
                    return;
                }
                // Generar número de póliza si no viene
                if (!venta.numeroPoliza) {
                    venta.numeroPoliza = '1406' + Math.floor(100000 + Math.random() * 900000);
                }
                const resultado = await DB.registrarVenta(venta, usuarioId);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ 
                    success: true, 
                    venta: resultado,
                    mensaje: 'SOAT emitido correctamente y registrado en APESEG.' 
                }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (pathname === '/api/apeseg-registros') {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Debe iniciar sesión para acceder a los registros APESEG.' }));
            return;
        }

        if (req.method === 'GET') {
            try {
                const registros = await DB.listarRegistrosApeseg();
                const placa = normalizarPlaca(String(parsedUrl.query.placa || '').trim());
                const cleanPlate = placa.replace(/[^A-Z0-9]/g, '');
                const filtrados = cleanPlate
                    ? registros.filter(registro => String(registro.placa || '').replace(/[^A-Z0-9]/gi, '').toUpperCase() === cleanPlate)
                    : registros;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(filtrados));
            } catch (e) {
                console.error('[APESEG] Error listando registros:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudieron cargar los registros APESEG.' }));
            }
            return;
        }

        if (req.method === 'PUT') {
            const idValue = String(parsedUrl.query.id || '');
            if (!/^[1-9]\d*$/.test(idValue) || !Number.isSafeInteger(Number(idValue))) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'El identificador del registro no es válido.' }));
                return;
            }

            let body = '';
            let bodyTooLarge = false;
            req.on('data', chunk => {
                if (body.length + chunk.length > 8192) {
                    bodyTooLarge = true;
                    return;
                }
                body += chunk;
            });
            req.on('end', async () => {
                if (bodyTooLarge) {
                    res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Solicitud demasiado grande.' }));
                    return;
                }

                let data;
                try {
                    data = JSON.parse(body);
                } catch {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Solicitud inválida.' }));
                    return;
                }

                const cambios = validarDatosRegistroApeseg(data);
                if (!cambios) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Completa placa, clase, compañía, póliza, costo, tipo de SOAT, estado y vigencias válidas.' }));
                    return;
                }

                try {
                    const registro = await DB.actualizarRegistroApeseg(Number(idValue), cambios);
                    if (!registro) {
                        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: 'No se encontró el registro APESEG.' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: true, registro }));
                } catch (e) {
                    console.error('[APESEG] Error actualizando registro:', e.message);
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'No se pudo actualizar el registro APESEG.' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE') {
            const idValue = String(parsedUrl.query.id || '');
            if (!/^[1-9]\d*$/.test(idValue) || !Number.isSafeInteger(Number(idValue))) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'El identificador del registro no es válido.' }));
                return;
            }

            try {
                const eliminado = await DB.eliminarRegistroApeseg(Number(idValue));
                if (!eliminado) {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'No se encontró el registro APESEG.' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                console.error('[APESEG] Error eliminando registro:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudo eliminar el registro APESEG.' }));
            }
            return;
        }

        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', Allow: 'GET, POST, PUT, DELETE' });
            res.end(JSON.stringify({ error: 'Método no permitido.' }));
            return;
        }

        let body = '';
        let bodyTooLarge = false;
        req.on('data', chunk => {
            if (body.length + chunk.length > 8192) {
                bodyTooLarge = true;
                return;
            }
            body += chunk;
        });
        req.on('end', async () => {
            if (bodyTooLarge) {
                res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Solicitud demasiado grande.' }));
                return;
            }

            let data;
            try {
                data = JSON.parse(body);
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Solicitud inválida.' }));
                return;
            }

            const registroDatos = validarDatosRegistroApeseg(data);
            if (!registroDatos) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Completa placa, clase, compañía, póliza, costo, tipo de SOAT, estado y vigencias válidas.' }));
                return;
            }

            try {
                const registro = await DB.registrarRegistroApeseg(registroDatos);
                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, registro }));
            } catch (e) {
                console.error('[APESEG] Error guardando registro:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudo guardar el registro APESEG.' }));
            }
        });
        return;
    }

    // ==========================================
    // 5.2 ENDPOINT: Listar ventas
    // ==========================================
    if (pathname === '/api/ventas' && (req.method === 'GET' || req.method === 'DELETE')) {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Debe iniciar sesión para consultar las ventas.' }));
            return;
        }

        if (req.method === 'DELETE') {
            const idValue = String(parsedUrl.query.id || '');
            if (!/^[1-9]\d*$/.test(idValue) || !Number.isSafeInteger(Number(idValue))) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'El identificador de la venta no es válido.' }));
                return;
            }

            try {
                const eliminado = await DB.eliminarVenta(Number(idValue));
                if (!eliminado) {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'No se encontró la venta.' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                console.error('[VENTAS] Error eliminando venta:', e.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudo eliminar la venta.' }));
            }
            return;
        }

        try {
            const esAdmin = (sesionValida.rol || '').toUpperCase() === 'ADMIN';
            const filtroUsuarioId = esAdmin ? null : (sesionValida.userId || sesionValida.id);

            const [ventas, registrosApeseg] = await Promise.all([
                DB.listarVentas(filtroUsuarioId),
                DB.listarRegistrosApeseg()
            ]);
            const registrosPorPlaca = new Map();
            registrosApeseg.forEach(registro => {
                const placa = String(registro.placa || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
                if (!registrosPorPlaca.has(placa)) registrosPorPlaca.set(placa, []);
                registrosPorPlaca.get(placa).push(registro);
            });
            const placasConVenta = new Set(ventas.map(venta =>
                String(venta.placa || '').replace(/[^A-Z0-9]/gi, '').toUpperCase()
            ));
            const ventasConRegistros = ventas.map(venta => {
                const placa = String(venta.placa || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
                return { ...venta, registros_apeseg: registrosPorPlaca.get(placa) || [] };
            });
            // Registros APESEG sueltos solo visibles para Admin
            if (esAdmin) {
                registrosPorPlaca.forEach((registros, placa) => {
                    if (!placasConVenta.has(placa)) {
                        ventasConRegistros.push({
                            placa: registros[0].placa,
                            contratante_nombre: '—',
                            clase: registros[0].clase || 'REGISTRO APESEG',
                            emitido_en: registros[0].creado_en,
                            monto: registros[0].costo,
                            numero_poliza: null,
                            registro_apeseg_sin_venta: true,
                            registros_apeseg: registros
                        });
                    }
                });
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(ventasConRegistros));
        } catch (e) {
            console.error('[VENTAS] Error listando ventas:', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No se pudieron cargar las ventas.' }));
        }
        return;
    }

    if (pathname === '/api/ventas') {
        res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', Allow: 'GET, DELETE' });
        res.end(JSON.stringify({ error: 'Método no permitido.' }));
        return;
    }

    // ==========================================
    // 5.3 ENDPOINTS: Gestión de Usuarios (Solo Admin)
    // ==========================================
    if (pathname === '/api/usuarios') {
        const sesionValida = await DB.validarSesion(sessionToken);
        if (!sesionValida) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Debe iniciar sesión.' }));
            return;
        }

        const esAdmin = (sesionValida.rol || '').toUpperCase() === 'ADMIN';
        if (!esAdmin) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Acceso denegado. Solo administradores pueden gestionar usuarios.' }));
            return;
        }

        if (req.method === 'GET') {
            try {
                const usuarios = await DB.listarUsuarios();
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, data: usuarios }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudo obtener la lista de usuarios.' }));
            }
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const nuevoUsuario = await DB.crearUsuario({
                        username: data.username,
                        password: data.password,
                        nombreCompleto: data.nombreCompleto,
                        agencia: data.agencia,
                        rol: data.rol || 'VENDEDOR'
                    });
                    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: true, data: nuevoUsuario }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: e.message || 'Error al crear usuario.' }));
                }
            });
            return;
        }

        if (req.method === 'DELETE') {
            const idValue = String(parsedUrl.query.id || '');
            if (!/^[1-9]\d*$/.test(idValue) || !Number.isSafeInteger(Number(idValue))) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'El identificador del usuario no es válido.' }));
                return;
            }

            try {
                const eliminado = await DB.eliminarUsuario(Number(idValue));
                if (!eliminado) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'No se puede eliminar la cuenta principal de administrador.' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'No se pudo eliminar el usuario.' }));
            }
            return;
        }

        res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8', Allow: 'GET, POST, DELETE' });
        res.end(JSON.stringify({ error: 'Método no permitido.' }));
        return;
    }

    // ==========================================
    // 6. ENDPOINT: Configuración (.env)
    // ==========================================
    if (pathname === '/api/config-sesion') {
        const sesionConfig = await DB.validarSesion(sessionToken);
        if (!sesionConfig || sesionConfig.rol !== 'ADMIN') {
            res.writeHead(sesionConfig ? 403 : 401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Se requiere una sesión de administrador.' }));
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const cfg = leerConfig();
                    if (data.databaseUrl !== undefined) {
                        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: 'La URL de base de datos solo se configura en el entorno del servidor.' }));
                        return;
                    }
                    for (const key of ['tokenYupay', 'cookieLaPositiva']) {
                        if (data[key] === undefined) continue;
                        if (typeof data[key] !== 'string' || /[\r\n]/.test(data[key])) {
                            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ error: `El valor de ${key} no es válido.` }));
                            return;
                        }
                        cfg[key] = data[key].trim();
                    }
                    if (!guardarConfig(cfg)) {
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: 'No se pudo guardar la configuración.' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        mensaje: 'Configuración guardada en .env',
                        tieneYupay: Boolean(cfg.tokenYupay && cfg.tokenYupay.length > 5)
                    }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
            return;
        } else {
            const cfg = leerConfig();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                tieneYupay: Boolean(cfg.tokenYupay && cfg.tokenYupay.length > 5),
                tienePostgres: Boolean(cfg.databaseUrl && cfg.databaseUrl.length > 5),
                puerto: cfg.puerto || 3000
            }));
            return;
        }
    }

    // ==========================================
    // 7. SERVIDOR DE ARCHIVOS ESTÁTICOS
    // ==========================================
    const consultaPath = '/pe/consultas-soat';
    if (pathname === `${consultaPath}/`) {
        res.writeHead(301, { Location: consultaPath });
        res.end();
        return;
    }

    if ([
        '/apeseg', '/apeseg/', '/apeseg/index.html', '/apeseg.html',
        '/consulta-soat', '/consulta-soat/',
        '/consultas-soat', '/consultas-soat/'
    ].includes(pathname)) {
        res.writeHead(301, { Location: consultaPath });
        res.end();
        return;
    }

    const host = req.headers.host || '';
    const isSubdomain = host.toLowerCase().startsWith('admin.');

    // REDIRECCIÓN SIEMPRE A CONSULTAS (Si no es admin)
    if (!isSubdomain && (pathname === '/' || pathname === '')) {
        res.writeHead(301, { Location: consultaPath });
        res.end();
        return;
    }

    // Si es subdominio admin y pide la raíz, servir admin.html (el login)
    if (isSubdomain && (pathname === '/' || pathname === '')) {
        const adminFilePath = path.join(BASE_DIR, 'admin.html');
        fs.readFile(adminFilePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Admin portal not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            }
        });
        return;
    }

    const publicRoutes = {
        [consultaPath]: 'apeseg.html',
        '/consulta-interna.html': path.join('apeseg', 'consulta-interna.html'),
        '/admin': 'admin.html',
        '/admin/': 'admin.html',
        '/admin.html': 'admin.html',
        '/index.html': 'index.html',
        '/login': 'admin.html',
        '/login.html': 'admin.html'
    };
    const publicPath = publicRoutes[pathname] || (pathname === '/' ? 'index.html' : pathname);
    let filePath = path.resolve(BASE_DIR, publicPath.replace(/^[/\\]+/, ''));
    const relativePath = path.relative(BASE_DIR, filePath);
    const pathSegments = relativePath.split(path.sep);
    const isWithinBase = relativePath !== '..' &&
        !relativePath.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relativePath);
    const hasHiddenSegment = pathSegments.some(segment => segment.startsWith('.'));
    const isPublicFile = (pathSegments.length === 1 && PUBLIC_ROOT_FILES.has(relativePath.toLowerCase())) ||
        (pathSegments.length > 1 && PUBLIC_STATIC_DIRECTORIES.has(pathSegments[0].toLowerCase()));

    if (!isWithinBase || hasHiddenSegment || !isPublicFile) {
        res.writeHead(403);
        res.end('Acceso denegado');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            const indexCandidate = path.join(filePath, 'index.html');
            if (fs.existsSync(indexCandidate)) {
                filePath = indexCandidate;
            } else if (fs.existsSync(filePath + '.html')) {
                filePath += '.html';
            }
        } else if (err || !stats.isFile()) {
            if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
                filePath += '.html';
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Archivo no encontrado: ' + pathname);
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno leyendo archivo');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

// Inicializar DB y luego escuchar
const cfg = leerConfig();
const PORT = cfg.puerto || 3000;

DB.initDB(cfg.databaseUrl, {
    adminUser: cfg.adminUser,
    adminPassword: cfg.adminPassword,
    adminNombre: cfg.adminNombre,
    adminAgencia: cfg.adminAgencia
}).then((dbStatus) => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log('====================================================');
        console.log('   SOAT LA POSITIVA - SISTEMA CON BASE DE DATOS');
        console.log('   AGENCIA: TACNA - HUGO CHURA Y ASOCIADOS CORREDORES');
        console.log('====================================================');
        console.log(` Servidor activo en: http://localhost:${PORT}`);
        console.log(` Base de datos: ${dbStatus.tipo} (${dbStatus.estado})`);
        console.log(` Seguridad: Acceso protegido a ventas/dashboard.`);
        console.log(' Usuario administrador configurado.');
        console.log(` Yupay API: ${cfg.tokenYupay ? 'SI (SUNARP en vivo)' : 'NO'}`);
        console.log('====================================================\n');
    });
}).catch(error => {
    console.error(`[CONFIG] No se pudo inicializar la base de datos: ${error.message}`);
    process.exitCode = 1;
});
