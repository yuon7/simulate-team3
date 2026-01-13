import { Hono } from 'hono';
import { prisma } from '@/lib/prisma';
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

type Variables = {
  user?: User;
};

const app = new Hono<{ Variables: Variables }>();

// Optional auth middleware
app.use("*", async (c, next) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    c.set("user", user);
  }
  await next();
});

// GET /api/jobs
app.get('/', async (c) => {
  const user = c.get("user");
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '10');
  const skip = (page - 1) * limit;

  // Filters
  const onlyMine = c.req.query('mine') === 'true';
  const prefectureId = c.req.query('prefectureId');
  const jobCategoryId = c.req.query('jobCategoryId');
  const query = c.req.query('q');
  const tags = c.req.query('tags')?.split(',');

  try {
    let where: any = {};

    if (onlyMine && user) {
      const staff = await prisma.staffProfile.findUnique({
        where: { userId: user.id },
      });
      if (staff) {
        where.organizationId = staff.organizationId;
      }
    }

    if (prefectureId) {
      where.location = {
        prefectureId: parseInt(prefectureId),
      };
    }

    if (jobCategoryId) {
      where.jobCategoryId = parseInt(jobCategoryId);
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: {
            select: { id: true, name: true, logoUrl: true },
          },
          location: {
            include: { prefecture: true },
          },
          jobCategory: true,
        },
      }),
      prisma.jobPosting.count({ where }),
    ]);

    const formattedJobs = await Promise.all(
      jobs.map(async (job) => {
        let logoUrl = null;
        if (job.organization.logoUrl) {
          const supabase = await createClient();
          const { data } = await supabase.storage
            .from("avatars")
            .createSignedUrl(job.organization.logoUrl, 3600);
          logoUrl = data?.signedUrl || null;
        }
        return {
          ...job,
          organization: {
            ...job.organization,
            logoUrl: logoUrl || job.organization.logoUrl,
          },
        };
      })
    );

    return c.json({
      data: formattedJobs,
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
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const body = await c.req.json();
    
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    if (!staff) return c.json({ error: "Only staff can create jobs" }, 403);

    const { 
      title, 
      description, 
      employmentType, 
      tags, 
      jobCategoryId, 
      locationId, 
      prefectureId, 
      city, 
      salaryMin, 
      salaryMax 
    } = body;

    let targetLocationId = locationId;

    if (!targetLocationId && prefectureId && city) {
      const location = await prisma.location.upsert({
        where: {
          prefectureId_city_street: {
            prefectureId: parseInt(prefectureId),
            city,
            street: "",
          },
        },
        update: {},
        create: {
          prefectureId: parseInt(prefectureId),
          city,
          street: "",
        },
      });
      targetLocationId = location.id;
    }

    if (!targetLocationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: staff.organizationId },
        select: { locationId: true },
      });
      targetLocationId = organization?.locationId;
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        description: description || '',
        organizationId: staff.organizationId,
        employmentType: employmentType || '正社員',
        tags: tags || [],
        jobCategoryId: jobCategoryId || 1,
        locationId: targetLocationId!,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
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

    let logoUrl = null;
    if (job.organization.logoUrl) {
      const supabase = await createClient();
      const { data } = await supabase.storage
        .from("avatars")
        .createSignedUrl(job.organization.logoUrl, 3600);
      logoUrl = data?.signedUrl || null;
    }

    const jobWithSignedUrl = {
      ...job,
      organization: {
        ...job.organization,
        logoUrl: logoUrl || job.organization.logoUrl,
      },
    };

    return c.json(jobWithSignedUrl);
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PUT /api/jobs/:id
app.put('/:id', async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = Number(c.req.param('id'));
  
  try {
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    if (!staff) return c.json({ error: "Forbidden" }, 403);

    const job = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!job) return c.json({ error: "Job not found" }, 404);
    if (job.organizationId !== staff.organizationId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const body = await c.req.json();
    const { 
      title, 
      description, 
      employmentType, 
      tags, 
      jobCategoryId, 
      locationId, 
      prefectureId, 
      city, 
      salaryMin, 
      salaryMax 
    } = body;

    let targetLocationId = locationId;

    if (!targetLocationId && prefectureId && city) {
      const location = await prisma.location.upsert({
        where: {
          prefectureId_city_street: {
            prefectureId: parseInt(prefectureId),
            city,
            street: "",
          },
        },
        update: {},
        create: {
          prefectureId: parseInt(prefectureId),
          city,
          street: "",
        },
      });
      targetLocationId = location.id;
    }

    const updatedJob = await prisma.jobPosting.update({
      where: { id },
      data: {
        title,
        description,
        employmentType,
        tags,
        jobCategoryId,
        ...(targetLocationId && { locationId: targetLocationId }),
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
      },
    });

    return c.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return c.json({ error: "Failed to update job" }, 500);
  }
});

// DELETE /api/jobs/:id
app.delete('/:id', async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = Number(c.req.param('id'));
  
  try {
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    if (!staff) return c.json({ error: "Forbidden" }, 403);

    const job = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!job) return c.json({ error: "Job not found" }, 404);
    if (job.organizationId !== staff.organizationId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await prisma.jobPosting.delete({
      where: { id },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return c.json({ error: "Failed to delete job" }, 500);
  }
});

export default app;
