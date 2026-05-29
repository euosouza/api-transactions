import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({
    path: ".env.test",
  });
} else {
  config();
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Variável de ambiente inválida:", _env.error.format());
  throw new Error("❌ Variável de ambiente inválida!");
}

export const env = _env.data;
