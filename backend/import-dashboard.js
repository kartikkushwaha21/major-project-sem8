const http = require('http');
const https = require('https');

async function downloadDashboard() {
    return new Promise((resolve, reject) => {
        https.get('https://grafana.com/api/dashboards/11159/revisions/1/download', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function uploadToGrafana(dashboard) {
    let dashStr = JSON.stringify(dashboard).replace(/\$\{DS_PROMETHEUS\}/g, "Prometheus");
    const payload = JSON.stringify({
        dashboard: JSON.parse(dashStr),
        overwrite: true
    });

    const options = {
        hostname: 'localhost',
        port: 3002,
        path: '/api/dashboards/db',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64'),
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function main() {
    try {
        console.log("Downloading Node.js dashboard 14430...");
        const dash = await downloadDashboard();
        console.log("Uploading to Grafana at localhost:3002...");
        const res = await uploadToGrafana(dash);
        console.log("Response:", res);
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
