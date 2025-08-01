const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing neon client setup...');

const clientPath = path.join('server', 'db', 'client.ts');

// Check if client.ts exists
if (!fs.existsSync(clientPath)) {
  console.error(`❌ File not found: ${clientPath}`);
  process.exit(1);
}

// Rewrite client.ts
const newClientContent = `import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!); // ✅ Correct usage
export const db = drizzle(sql, { schema });
`;

fs.writeFileSync(clientPath, newClientContent);
console.log('✅ Updated server/db/client.ts');

// Uninstall incorrect version
try {
  console.log('📦 Uninstalling conflicting @neondatabase/serverless...');
  execSync('npm uninstall @neondatabase/serverless', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️ Failed to uninstall (maybe not installed yet)');
}

// Install correct version
try {
  console.log('📦 Installing @neondatabase/serverless@0.1.13...');
  execSync('npm install @neondatabase/serverless@0.1.13', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Failed to install @neondatabase/serverless@0.1.13');
  process.exit(1);
}

console.log('✅ All done! Now run: npm run dev');
