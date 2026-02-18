const net = require('net');
const fs = require('fs');
const client = new net.Socket();
client.connect(5000, '127.0.0.1', () => {
    fs.writeFileSync('port_5000_status.txt', 'OPEN');
    client.destroy();
});
client.on('error', (err) => {
    fs.writeFileSync('port_5000_status.txt', 'CLOSED: ' + err.message);
});
setTimeout(() => process.exit(0), 2000);
