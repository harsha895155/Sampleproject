const fs = require('fs');
const path = require('path');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
fs.writeFileSync(path.join(__dirname, 'i_was_here.txt'), 'hello');
