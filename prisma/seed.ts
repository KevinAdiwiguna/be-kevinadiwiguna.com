import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding roles...");
  const roles = ['owner', 'admin', 'moderator', 'user'];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  console.log("🌱 Seeding permissions...");

  const permissions = {
    experience: ["create_experience", "read_experience", "read_experience_id", "update_experience", "delete_experience"],
    hero: ['create_hero', 'update_hero', 'delete_hero', 'read_hero', "read_hero_id"],
    blog: ['create_blog', 'update_blog', 'delete_blog', 'read_blog'],
    project: ['create_project', 'update_project', 'delete_project', 'read_project'],
    user: ['delete_user', 'read_user'],
    comment: ['create_comment', 'update_comment', 'delete_comment', 'read_comment'],
    skill: ['create_skill', 'update_skill', 'delete_skill'],
    files: ['upload_files', 'delete_files'],
    auth: [
      'signin',
      'signup',
      'send_otp',
      'verify_otp',
      'signout_single_device',
      'signout_all_device',
    ],
  };

  const allPermissionValues = Object.values(permissions).flat();

  for (const perm of allPermissionValues) {
    await prisma.permissions.upsert({
      where: { name: perm },
      update: {},
      create: {
        name: perm,
        label: perm.replace(/_/g, ' '),
      },
    });
  }

  console.log("🌱 Assigning ALL permissions to ALL roles...");

  const allRoles = await prisma.roles.findMany();
  const allPermissions = await prisma.permissions.findMany();

  for (const role of allRoles) {
    for (const perm of allPermissions) {
      await prisma.roles_permissions.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log("🎉 Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
