import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");
const prisma = new PrismaClient();

// app.get("/todos", async (c) => {
//   const todos = await prisma.todo.findMany();
//   return c.json(todos);
// });

// app.post("/todos", async (c) => {
//   const body = await c.req.json();
//   const { title } = body;
//   if (!title) {
//     return c.json({ error: "Title is required" }, 400);
//   }
//   const newTodos = await prisma.todo.create({
//     data: {
//       title,
//     },
//   });
//   return c.json(newTodos, 201);
// });

// app.put("/todos/:id", async (c) => {
//   const id = parseInt(c.req.param("id"), 10);
//   if (isNaN(id)) {
//     return c.json({ error: "Invalid ID" }, 400);
//   }
//   const body = await c.req.json();
//   const { done } = body;
//   if (typeof done !== "boolean") {
//     return c.json({ error: "Done is required" }, 400);
//   }
//   const updatedTodo = await prisma.todo.update({
//     where: { id },
//     data: { done },
//   });
//   return c.json(updatedTodo);
// });

// app.delete("/todos/:id", async (c) => {
//   const id = parseInt(c.req.param("id"), 10);
//   await prisma.todo.delete({
//     where: { id },
//   });
//   return c.json({ message: "Todo deleted" });
// });

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);