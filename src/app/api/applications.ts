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
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
});

// GET /api/applications
app.get("/", async (c) => {
  const user = c.get("user") as any;

  try {
    // Check if user is STAFF and get their organization
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
      select: { organizationId: true },
    });

    if (!staff) {
      // If not staff, maybe they are candidate?
      // Let's assume this endpoint is for staff for now,
      // or return candidate's own applications if candidate.
      const applications = await (prisma as any).application.findMany({
        where: { candidateId: user.id },
        include: {
          jobPosting: {
            include: { organization: true },
          },
          messages: {
            where: {
              senderId: { not: user.id },
              readAt: null,
            },
          },
        },
      });

      const formattedApplications = applications.map((app: any) => ({
        ...app,
        unreadCount: app.messages.length,
        messages: undefined,
      }));

      return c.json(formattedApplications);
    }

    // Return applications for jobs in this organization
    const applications = await (prisma as any).application.findMany({
      where: {
        jobPosting: {
          organizationId: staff.organizationId,
        },
      },
      include: {
        candidate: {
          include: { user: true },
        },
        jobPosting: true,
        messages: {
          where: {
            senderId: { not: user.id },
            readAt: null,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedApplications = applications.map((app: any) => ({
      ...app,
      unreadCount: app.messages.length,
      messages: undefined, // Remove messages to keep payload small
    }));

    return c.json(formattedApplications);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch applications" }, 500);
  }
});

// POST /api/applications
app.post("/", async (c) => {
  const user = c.get("user") as any;
  try {
    const { jobPostingId } = await c.req.json();

    if (!jobPostingId) {
      return c.json({ error: "Job Posting ID is required" }, 400);
    }

    const application = await prisma.application.create({
      data: {
        candidateId: user.id,
        jobPostingId: Number(jobPostingId),
        status: "PENDING",
      },
    });

    return c.json({ success: true, application });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to apply" }, 500);
  }
});

export default app;
