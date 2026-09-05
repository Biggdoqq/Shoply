import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Starting Vercel Full Build for Shoply...');

// 1. Install dependencies
console.log('📦 Installing client dependencies...');
execSync('npm --prefix client install', { stdio: 'inherit', cwd: rootDir });

console.log('📦 Installing admin dependencies...');
execSync('npm --prefix admin install', { stdio: 'inherit', cwd: rootDir });

// 2. Build Client and Admin
console.log('⚡ Building Client Storefront...');
execSync('npm --prefix client run build', { stdio: 'inherit', cwd: rootDir });

console.log('⚡ Building Admin Portal...');
execSync('npm --prefix admin run build', { stdio: 'inherit', cwd: rootDir });

// 3. Copy Admin dist into Client dist at /admin
const clientDist = path.join(rootDir, 'client/dist');
const adminDist = path.join(rootDir, 'admin/dist');
const targetAdmin = path.join(clientDist, 'admin');

console.log(`📂 Merging Admin build into ${targetAdmin}...`);
if (fs.existsSync(targetAdmin)) {
  fs.rmSync(targetAdmin, { recursive: true, force: true });
}
fs.cpSync(adminDist, targetAdmin, { recursive: true });

console.log('✅ Build completed successfully! All assets ready in client/dist');
