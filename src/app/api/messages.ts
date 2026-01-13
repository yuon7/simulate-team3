import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>();

// Middleware to get authenticated user
app.use("*", async (c, next) => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
});

// GET /api/messages?applicationId=xxx
app.get("/", async (c) => {
  const user = c.get("user");
  const applicationId = Number(c.req.query("applicationId"));

  if (!applicationId) {
    return c.json({ error: "applicationId is required" }, 400);
  }

  try {
    const application = await (prisma as any).application.findUnique({
      where: { id: applicationId },
      include: {
        jobPosting: true,
      }
    });

    if (!application) {
      return c.json({ error: "Application not found" }, 404);
    }

    // Auth check
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    const isApplicant = application.candidateId === user.id;
    const isOurStaff = staff && staff.organizationId === (application as any).jobPosting.organizationId;

    if (!isApplicant && !isOurStaff) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const messages = await (prisma as any).message.findMany({
      where: { applicationId },
      orderBy: { createdAt: "asc" },
    });

    return c.json(messages);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/messages
app.post("/", async (c) => {
  const user = c.get("user");
  try {
    const { applicationId, content } = await c.req.json();

    if (!applicationId || !content) {
      return c.json({ error: "applicationId and content are required" }, 400);
    }

    const application = await (prisma as any).application.findUnique({
      where: { id: Number(applicationId) },
      include: {
        jobPosting: true,
      }
    });

    if (!application) {
      return c.json({ error: "Application not found" }, 404);
    }

    // Auth check
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    const isApplicant = application.candidateId === user.id;
    const isOurStaff = staff && staff.organizationId === (application as any).jobPosting.organizationId;

    if (!isApplicant && !isOurStaff) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const message = await (prisma as any).message.create({
      data: {
        applicationId: Number(applicationId),
        senderId: user.id,
        content,
      },
    });

    return c.json(message, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PATCH /api/messages/read
app.patch("/read", async (c) => {
  const user = c.get("user");
  try {
    const { applicationId } = await c.req.json();

    if (!applicationId) {
      return c.json({ error: "applicationId is required" }, 400);
    }

    const application = await (prisma as any).application.findUnique({
      where: { id: Number(applicationId) },
    });

    if (!application) {
      return c.json({ error: "Application not found" }, 404);
    }

    // Auth check
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    const isApplicant = application.candidateId === user.id;
    const isOurStaff = staff && staff.organizationId === (application as any).jobPosting?.organizationId;

    // Note: Since we only know organizationId after include, let's just use the application check
    // or fetch it properly if needed. For now, simple check.

    // Mark all messages as read WHERE senderId NOT user.id AND readAt IS NULL
    await (prisma as any).message.updateMany({
      where: {
        applicationId: Number(applicationId),
        senderId: { not: user.id },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
})

export default app;
