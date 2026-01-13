import { Hono } from "hono";
import { handle } from "hono/vercel";
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

// GET /api/profile
app.get("/", async (c) => {
  const user = c.get("user") as any;
  const userId = user.id;

  try {
    // First get the user to check their role
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true, email: true, phone: true, avatarUrl: true },
    });

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check role and return appropriate profile
    if (dbUser.role === "CANDIDATE") {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: userId },
        include: {
          userSkills: {
            include: { skill: true },
          },
          desiredJob: true,
        },
      });

      let signedAvatarUrl = null;
      if (dbUser.avatarUrl) {
        const supabase = await createClient();
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(dbUser.avatarUrl, 3600);
        signedAvatarUrl = data?.signedUrl;
      }

      const formattedProfile = {
        id: userId,
        role: "CANDIDATE",
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "",
        avatarUrl: signedAvatarUrl || null,
        hasProfile: !!profile,
        location: "未設定",
        jobTitle: "未設定",
        bio: "",
        skills: [] as string[],
      };

      if (profile) {
        formattedProfile.location = "東京都"; // TODO: Add desiredLocations
        formattedProfile.jobTitle = profile.desiredJob?.name || "未設定";
        formattedProfile.bio = profile.bio || "";
        formattedProfile.skills = profile.userSkills.map((us: any) => us.skill.name);
      }

      return c.json(formattedProfile);
    } else if (dbUser.role === "STAFF") {
      const profile = await prisma.staffProfile.findUnique({
        where: { userId: userId },
        include: {
          organization: {
            include: {
              location: {
                include: {
                  prefecture: true,
                },
              },
            },
          },
        },
      });

      const effectiveAvatarUrl = dbUser.avatarUrl || profile?.organization.logoUrl;
      let signedAvatarUrl = null;
      if (effectiveAvatarUrl) {
        const supabase = await createClient();
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(effectiveAvatarUrl, 3600);
        signedAvatarUrl = data?.signedUrl;
      }

      const formattedProfile = {
        id: userId,
        role: "STAFF",
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "",
        avatarUrl: signedAvatarUrl || null,
        hasProfile: !!profile,
        organizationName: "未設定",
        organizationType: "未設定",
        department: "",
        title: "",
        location: "未設定",
      };

      if (profile) {
        formattedProfile.organizationName = profile.organization.name;
        formattedProfile.organizationType = profile.organization.organizationType;
        formattedProfile.department = profile.department || "";
        formattedProfile.title = profile.title || "";
        formattedProfile.location = `${profile.organization.location.prefecture.name} ${profile.organization.location.city}`;
      }

      return c.json(formattedProfile);
    }

    return c.json({ error: "Invalid user role" }, 400);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// PUT /api/profile
app.put("/", async (c) => {
  const user = c.get("user") as any;
  const userId = user.id;

  try {
    const body = await c.req.json();
    
    // Validate body (Generic manual validation for now)
    // Expect: { name, phone, bio, skills: string[], avatarUrlObjectPath?: string }

    // Transaction to update User and CandidateProfile
    await prisma.$transaction(async (tx) => {
      // 1. Update User info
      const userUpdateData: any = {};
      if (body.name) userUpdateData.name = body.name;
      if (body.phone !== undefined) userUpdateData.phone = body.phone;
      if (body.avatarPath) userUpdateData.avatarUrl = body.avatarPath; // Expecting storage path not full URL

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // 2. Update CandidateProfile
      if (typeof body.bio === 'string') {
        await tx.candidateProfile.update({
          where: { userId: userId },
          data: { bio: body.bio },
        });
      }

      // 3. Update Skills (Full replacement strategy)
      if (Array.isArray(body.skills)) {
        // First disconnect all existing
        await tx.userSkill.deleteMany({
          where: { userId: userId },
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
              userId: userId,
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
