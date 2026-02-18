const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'server_output.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

console.log('Starting server...');
const child = spawn('node', ['index.js'], {
    cwd: __dirname,
    env: process.env,
    stdio: 'pipe'
});

child.stdout.on('data', (data) => {
    process.stdout.write(data);
    logStream.write(data);
});

child.stderr.on('data', (data) => {
    process.stderr.write(data);
    logStream.write(data);
});

child.on('error', (err) => {
    fs.appendFileSync(logPath, `SPAWN ERROR: ${err.message}\n`);
    console.error('Spawn error:', err);
});

child.on('exit', (code) => {
    fs.appendFileSync(logPath, `SERVER EXITED WITH CODE: ${code}\n`);
    console.log('Server exited with code:', code);
});

console.log(`Server process spawned with PID: ${child.pid}. Check server_output.log for persistent output.`);
// Keep process alive for a bit to see initial output
setTimeout(() => {
    process.exit(0);
}, 5000);
