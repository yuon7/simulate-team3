import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const prefectures = await prisma.prefecture.findMany({
      orderBy: { id: "asc" },
    });
    return c.json(prefectures);
  } catch (error) {
    return c.json({ error: "Failed to fetch prefectures" }, 500);
  }
});

export default app;
