import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { matchAgent } from "./agents/userAgents";

export const mastra = new Mastra({
  workflows: {},
  agents: {
    matchAgent,
  },
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL!,
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
