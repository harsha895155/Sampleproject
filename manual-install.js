const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, 'client', 'node_modules');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const packages = [
    { name: 'react', url: 'https://registry.npmjs.org/react/-/react-19.0.0.tgz' },
    { name: 'react-dom', url: 'https://registry.npmjs.org/react-dom/-/react-dom-19.0.0.tgz' },
    { name: 'scheduler', url: 'https://registry.npmjs.org/scheduler/-/scheduler-0.25.0.tgz' },
    { name: 'react-router-dom', url: 'https://registry.npmjs.org/react-router-dom/-/react-router-dom-6.20.0.tgz' },
    { name: 'react-router', url: 'https://registry.npmjs.org/react-router/-/react-router-6.20.0.tgz' },
    { name: '@remix-run/router', url: 'https://registry.npmjs.org/@remix-run/router/-/router-1.11.0.tgz' },
    { name: 'axios', url: 'https://registry.npmjs.org/axios/-/axios-1.6.7.tgz' },
    { name: 'lucide-react', url: 'https://registry.npmjs.org/lucide-react/-/lucide-react-0.323.0.tgz' }
];

async function downloadAndExtract(pkg) {
    const dest = path.join(targetDir, pkg.name);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    const tarPath = path.join(__dirname, `${pkg.name.replace(/\//g, '-')}.tgz`);
    const file = fs.createWriteStream(tarPath);
    
    console.log(`Downloading ${pkg.name}...`);
    return new Promise((resolve, reject) => {
        https.get(pkg.url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${pkg.name}: ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Extracting ${pkg.name}...`);
                try {
                    execSync(`tar -xzf "${tarPath}" -C "${dest}" --strip-components=1`, { stdio: 'inherit' });
                    fs.unlinkSync(tarPath);
                    console.log(`Success: ${pkg.name}`);
                    resolve();
                } catch (e) {
                    console.error(`Extraction failed for ${pkg.name}`);
                    reject(e);
                }
            });
        }).on('error', (e) => {
            if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
            reject(e);
        });
    });
}

(async () => {
    console.log('--- Manual Dependency Injection Starting ---');
    for (const pkg of packages) {
        try {
            await downloadAndExtract(pkg);
        } catch (e) {
            console.error(`Skipping ${pkg.name} due to error:`, e.message);
        }
    }
    console.log('--- Manual Injection Complete ---');
})();
