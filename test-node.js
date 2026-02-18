const fs = require('fs');
fs.writeFileSync('c:\\Users\\harsh\\sampleproject\\test_node_success.txt', 'Node is working at ' + new Date().toISOString());
console.log('Test file created');
process.exit(0);
