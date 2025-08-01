const fs = require('fs');
const path = require('path');

const CLIENT_FILE = path.join(__dirname, 'server', 'db', 'client.ts');
const PACKAGE_FILE = path.join(__dirname, 'package.json');
const TSCONFIG_FILE = path.join(__dirname, 'tsconfig.json');

console.log('🔧 Fixing neon import...');

// ✅ Step 1: Fix neon import in client.ts
const fixedClientContent = `import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { config } from 'dotenv';

config(); // Load environment variables

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
`;

try {
  fs.writeFileSync(CLIENT_FILE, fixedClientContent);
  console.log('✅ Patched: server/db/client.ts');
} catch (err) {
  console.error('❌ Failed to patch client.ts:', err.message);
}

// ✅ Step 2: Ensure tsconfig.json matches CommonJS setup
try {
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

  fs.writeFileSync(TSCONFIG_FILE, JSON.stringify(tsConfig, null, 2));
  console.log('✅ Updated: tsconfig.json');
} catch (err) {
  console.error('❌ Failed to update tsconfig.json:', err.message);
}

// ✅ Step 3: Ensure package.json uses type=commonjs
try {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
  pkg.type = 'commonjs';
  fs.writeFileSync(PACKAGE_FILE, JSON.stringify(pkg, null, 2));
  console.log('✅ Updated: package.json with type=commonjs');
} catch (err) {
  console.error('❌ Failed to update package.json:', err.message);
}

console.log('\n✅ All done. Now run:');
console.log('   npm install @neondatabase/serverless@latest drizzle-orm');
console.log('   npm run dev');
