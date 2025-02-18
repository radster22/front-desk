import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  //url: "migration", // Specify the mode, for migration generation
});
