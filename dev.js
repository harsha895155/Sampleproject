const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const logFile = fs.createWriteStream('dev_js_log.txt', { flags: 'a' });

function log(msg) {
    logFile.write(`${new Date().toISOString()} - ${msg}\n`);
}

log('--- Starting Unified Dev Stack ---');

// 1. Start Real Backend (index.js on port 5011)
const backend = spawn('node', ['server/index.js'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
});

backend.stdout.on('data', (data) => log(`[Backend STDOUT]: ${data}`));
backend.stderr.on('data', (data) => log(`[Backend STDERR]: ${data}`));

// 2. Start Vite Frontend
const frontend = spawn('npx', ['vite', '--host', '--port', '5173', '--no-open'], {
    cwd: path.join(__dirname, 'client'),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
});

frontend.stdout.on('data', (data) => log(`[Frontend STDOUT]: ${data}`));
frontend.stderr.on('data', (data) => log(`[Frontend STDERR]: ${data}`));

backend.on('error', (err) => log(`Backend failed to start: ${err}`));
frontend.on('error', (err) => log(`Frontend failed to start: ${err}`));

console.log('Orchestration script running. Check dev_js_log.txt');
