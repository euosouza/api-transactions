import type { Knex } from "knex";
import setupKnex from "knex";

import { env } from "./env/index";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
