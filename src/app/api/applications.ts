import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const app = new Hono();

const MOCK_USER_ID = "testid-candidate";

// POST /api/applications
app.post("/", async (c) => {
  try {
    const { jobPostingId } = await c.req.json();

    if (!jobPostingId) {
      return c.json({ error: "Job Posting ID is required" }, 400);
    }

    // Check if duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobPostingId: {
          candidateId: MOCK_USER_ID,
          jobPostingId: Number(jobPostingId),
        },
      },
    });

    if (existing) {
      return c.json({ error: "Already applied" }, 409);
    }

    const application = await prisma.application.create({
      data: {
        candidateId: MOCK_USER_ID,
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
