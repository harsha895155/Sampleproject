const { execSync } = require('child_process');
try {
    const out = execSync('npm config get registry', { encoding: 'utf8' });
    console.log('Registry:', out);
    const out2 = execSync('npm install react-router-dom --no-audit --no-fund --prefer-offline', { encoding: 'utf8', timeout: 60000 });
    console.log('Install Result:', out2);
} catch (e) {
    console.error('Error:', e.message);
    console.error('Stdout:', e.stdout);
    console.error('Stderr:', e.stderr);
}
