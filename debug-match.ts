import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Testing Prisma Query...");
    try {
        const jobPostings = await prisma.jobPosting.findMany({
            include: {
                organization: true,
                location: {
                    include: {
                        prefecture: true,
                    },
                },
                requiredSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });
        console.log("JobPostings found:", jobPostings.length);
        if (jobPostings.length > 0) {
            console.log("First job:", JSON.stringify(jobPostings[0], null, 2));
        }
    } catch (error) {
        console.error("Prisma Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
