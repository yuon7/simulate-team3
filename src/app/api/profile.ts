import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const app = new Hono();

// Fixed test user ID for mock auth
const MOCK_USER_ID = "testid-candidate";

// GET /api/profile
app.get("/", async (c) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: MOCK_USER_ID },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        userSkills: {
          include: { skill: true },
        },
        desiredJob: true,
      },
    });

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    // Format response to match UI needs
    const formattedProfile = {
      name: profile.user.name,
      email: profile.user.email,
      phone: profile.user.phone || "",
      location: "東京都", // TODO: Add desiredLocations or actual location to schema? For now hardcode or use seed's imply
      role: profile.desiredJob?.name || "未設定",
      bio: profile.bio || "",
      skills: profile.userSkills.map((us) => us.skill.name),
    };

    return c.json(formattedProfile);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// PUT /api/profile
app.put("/", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate body (Generic manual validation for now)
    // Expect: { name, phone, bio, skills: string[] }

    // Transaction to update User and CandidateProfile
    await prisma.$transaction(async (tx) => {
      // 1. Update User info
      if (body.name || body.phone) {
        await tx.user.update({
          where: { id: MOCK_USER_ID },
          data: {
            name: body.name,
            phone: body.phone,
          },
        });
      }

      // 2. Update CandidateProfile
      if (typeof body.bio === 'string') {
        await tx.candidateProfile.update({
          where: { userId: MOCK_USER_ID },
          data: { bio: body.bio },
        });
      }

      // 3. Update Skills (Full replacement strategy)
      if (Array.isArray(body.skills)) {
        // Find existing skills to get IDs, create new if needed
        // For simplicity, let's assume skills are strings.
        // First disconnect all existing
        await tx.userSkill.deleteMany({
          where: { userId: MOCK_USER_ID },
        });

        for (const skillName of body.skills) {
          // Upsert Skill
          const skill = await tx.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName },
          });

          // Connect UserSkill
          await tx.userSkill.create({
            data: {
              userId: MOCK_USER_ID,
              skillId: skill.id,
              proficiency: "INTERMEDIATE", // Default
            },
          });
        }
      }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

export default app;
