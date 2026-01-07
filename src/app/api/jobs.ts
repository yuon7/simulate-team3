import { Hono } from 'hono';
import { prisma } from '@/lib/prisma';

const app = new Hono();

// GET /api/jobs
app.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '10');
  const skip = (page - 1) * limit;

  // Add filters later: location, category, tag...
  const location = c.req.query('location');

  try {
    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: {
            select: { name: true, logoUrl: true },
          },
          // location: true, // Need to confirm relation
        },
      }),
      prisma.jobPosting.count(),
    ]);

    return c.json({
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// POST /api/jobs
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Basic validation (Replace with Zod)
    if (!body.title || !body.organizationId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const job = await prisma.jobPosting.create({
      data: {
        title: body.title,
        description: body.description || '',
        organizationId: body.organizationId,
        employmentType: body.employmentType || '正社員',
        tags: body.tags || [],
        jobCategoryId: body.jobCategoryId || 1, // Fallback/Mock for now if category not provided
        locationId: body.locationId || 1, // Fallback/Mock
      },
    });

    return c.json(job, 201);
  } catch (error) {
    console.error('Error creating job:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

// GET /api/jobs/:id
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        organization: true,
        location: {
            include: { prefecture: true }
        },
        jobCategory: true,
      }
    });

    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    return c.json(job);
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
