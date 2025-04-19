/**
 * Sets up authentication using `better-auth` with SQLite3 as the database.
 *
 * - Recreates `__dirname` in ESM using `fileURLToPath` and `path.dirname()`.
 * - Resolves the path to the SQLite database (`auth.db`) with `path.resolve()`.
 * - Configures authentication with email/password and Bearer Token using the `better-auth` library and the `bearer` plugin.
 */
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { bearer } from "better-auth/plugins";
import path from "path";
import { fileURLToPath } from "url";

//Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "auth.db");

export const auth = betterAuth({
  database: new Database(dbPath),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [bearer()],
});
