const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "server", "db", "client.ts");

const fixedContent = `const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const dotenv = require('dotenv');
const schema = require('./schema');

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

module.exports = { db };
`;

if (fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, fixedContent, "utf8");
  console.log("✅ Fixed: server/db/client.ts (Final Option A with named import)");
} else {
  console.error("❌ Could not find server/db/client.ts");
}
