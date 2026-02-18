const https = require('https');
https.get('https://www.google.com', (res) => {
    console.log('Status Code:', res.statusCode);
    process.exit(0);
}).on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
});
