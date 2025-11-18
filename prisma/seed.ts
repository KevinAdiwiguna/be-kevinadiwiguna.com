import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking roles...");

  const defaultRoles = ["owner", "editor", "moderator", "user"];

  const existing = await prisma.roles.findMany({
    where: { name: { in: defaultRoles } },
    select: { name: true },
  });

  const existingNames = existing.map((r) => r.name);

  const missing = defaultRoles.filter((role) => !existingNames.includes(role));

  if (missing.length > 0) {
    await prisma.roles.createMany({
      data: missing.map((name) => ({ name })),
    });

    console.log("✨ Added missing roles:", missing);
  } else {
    console.log("✔ All roles already exist.");
  }

  console.log("🎉 Done!");
}

main()
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
