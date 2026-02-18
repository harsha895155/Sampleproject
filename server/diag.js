const express = require('express');
const app = express();
const PORT = 5011;

app.get('/test', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log('DIAGNOSTIC SERVER RUNNING ON ' + PORT);
    process.exit(0);
});

setTimeout(() => {
    console.log('DIAGNOSTIC SERVER TIMEOUT');
    process.exit(1);
}, 5000);
