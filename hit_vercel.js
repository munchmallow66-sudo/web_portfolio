const https = require('https');
const data = JSON.stringify({
    title: "Test Activity Thai",
    description: "Desc",
    date: "2026-03-22"
});

const req = https.request({
    hostname: 'webportfolio-pi-brown.vercel.app',
    path: '/api/admin/activities',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    let body = '';
    res.on('data', c => body += c.toString());
    res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
