const http = require('http');
const fs = require('fs');
http.get('http://localhost:5173/src/main.jsx', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('vite_debug_output.txt', `Status: ${res.statusCode}\nBody: ${data}`);
        console.log('Done');
        process.exit(0);
    });
}).on('error', (e) => {
    fs.writeFileSync('vite_debug_output.txt', `Error: ${e.message}`);
    process.exit(1);
});
