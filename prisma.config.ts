// Load .env.local first (Next.js convention), then fall back to .env
import "dotenv/config";
import * as dotenv from "dotenv";
import * as fs from "fs";
if (fs.existsSync(".env.local")) dotenv.config({ path: ".env.local", override: true });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
