import { Mastra } from "@mastra/core/mastra";
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
});
