const http = require('http');

const data = JSON.stringify({
    title: "Test",
    description: "test desc",
    date: "2026-03-22"
});

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/activities',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, res => {
    let body = '';
    res.on('data', chunk => body += chunk.toString());
    res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', console.error);
req.write(data);
req.end();
