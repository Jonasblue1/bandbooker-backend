const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

function updateJSONFile(filePath, modifyCallback) {
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  modifyCallback(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`✅ Updated: ${filePath}`);
}

function updateTsConfig() {
  const tsConfigPath = path.resolve('tsconfig.json');
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      module: "CommonJS",
      moduleResolution: "node",
      outDir: "dist",
      rootDir: ".",
      baseUrl: ".",
      esModuleInterop: true,
      resolveJsonModule: true,
      strict: true,
      skipLibCheck: true
    },
    include: [
      "server/**/*",
      "client/**/*",
      "db/**/*",
      "drizzle.config.ts"
    ],
    exclude: [
      "node_modules",
      "dist"
    ]
  };
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf8');
  console.log(`✅ Reset: tsconfig.json`);
}

function updatePackageJson() {
  updateJSONFile('package.json', pkg => {
    pkg.type = 'commonjs';
    pkg.scripts = {
      ...pkg.scripts,
      dev: 'ts-node --transpile-only server/index.ts',
      start: 'node dist/index.js',
      migrate: 'drizzle-kit push',
      build: 'vite build',
      client: 'vite'
    };
  });
}

function renameMtsToTs(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      renameMtsToTs(fullPath);
    } else if (item.endsWith('.mts')) {
      const tsPath = fullPath.replace(/\.mts$/, '.ts');
      fs.renameSync(fullPath, tsPath);
      console.log(`📝 Renamed: ${item} → ${path.basename(tsPath)}`);
    }
  });
}

function ensureDependencies() {
  console.log('📦 Installing required packages...');
  execSync('npm install ts-node typescript dotenv', { stdio: 'inherit' });
  execSync('npm install -D @types/node @types/express @types/express-session', { stdio: 'inherit' });
}

function main() {
  console.log('🔧 Fixing project setup...');
  updateTsConfig();
  updatePackageJson();
  renameMtsToTs(path.resolve('.'));
  ensureDependencies();
  console.log('\n✅ All done! Now run: npm run dev');
}

main();
