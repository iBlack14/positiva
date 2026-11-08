const https = require('https');

const token = process.env.YUPAY_TOKEN;
if (!token) {
    throw new Error('Define YUPAY_TOKEN en el entorno antes de ejecutar este diagnóstico.');
}
const plate = 'Z4A120';

const endpoints = [
    `/v1/soat/${plate}`,
    `/v1/vehiculo/${plate}`,
    `/v1/vehiculos/${plate}`,
    `/v1/sunarp/${plate}`,
    `/v1/sunarp/placa/${plate}`,
    `/v1/placas/${plate}`,
    `/v1/consulta/placa/${plate}`,
    `/v1/consultas/placa/${plate}`,
    `/v1/soat?placa=${plate}`,
    `/v1/placa?numero=${plate}`,
    `/v1/dni/00000000` // to check format
];

function checkPath(p) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.yupay.dev',
            port: 443,
            path: p,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            timeout: 5000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let code = '';
                try {
                    const j = JSON.parse(data);
                    code = j.error ? j.error.code || j.error.message : 'SUCCESS';
                } catch(e) {
                    code = data.substring(0, 50);
                }
                console.log(`${res.statusCode} | ${p} => ${code}`);
                if (res.statusCode === 200 || (res.statusCode !== 404 && !data.includes('La ruta solicitada no existe'))) {
                    console.log('   FULL BODY:', data);
                }
                resolve();
            });
        });

        req.on('error', () => resolve());
        req.end();
    });
}

async function run() {
    for (const ep of endpoints) {
        await checkPath(ep);
    }
}

run();
