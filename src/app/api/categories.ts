import { Hono } from 'hono';
import { prisma } from '@/lib/prisma';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return c.json(categories);
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

export default app;
