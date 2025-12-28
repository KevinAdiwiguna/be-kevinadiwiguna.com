import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  EDITOR: "editor",
  USER: "user",
} as const;


const PERMISSIONS = {
  BLOG: {
    CREATE: "blog:create",
    READ: "blog:read",
    UPDATE: "blog:update",
    DELETE: "blog:delete",
  },
  PROJECT: {
    CREATE: "project:create",
    READ: "project:read",
    UPDATE: "project:update",
    DELETE: "project:delete",
  },
  EXPERIENCE: {
    CREATE: "experience:create",
    READ: "experience:read",
    UPDATE: "experience:update",
    DELETE: "experience:delete",
  },
  HERO: {
    CREATE: "hero:create",
    READ: "hero:read",
    UPDATE: "hero:update",
    DELETE: "hero:delete",
  },
  USER: {
    READ: "user:read",
    DELETE: "user:delete",
  },
  COMMENT: {
    CREATE: "comment:create",
    READ: "comment:read",
    UPDATE: "comment:update",
    DELETE: "comment:delete",
  },
  SKILL: {
    CREATE: "skill:create",
    UPDATE: "skill:update",
    DELETE: "skill:delete",
  },
  FILE: {
    UPLOAD: "file:upload",
    DELETE: "file:delete",
  },
  AUTH: {
    SIGNIN: "auth:signin",
    SIGNUP: "auth:signup",
    SEND_OTP: "auth:send_otp",
    VERIFY_OTP: "auth:verify_otp",
    SIGNOUT_SINGLE: "auth:signout_single",
    SIGNOUT_ALL: "auth:signout_all",
  },
} as const;


const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPERADMIN]: [
    ...Object.values(PERMISSIONS).flatMap((group) =>
      Object.values(group)
    ),
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.BLOG.CREATE,
    PERMISSIONS.BLOG.READ,
    PERMISSIONS.BLOG.UPDATE,
    PERMISSIONS.BLOG.DELETE,

    PERMISSIONS.PROJECT.CREATE,
    PERMISSIONS.PROJECT.READ,
    PERMISSIONS.PROJECT.UPDATE,
    PERMISSIONS.PROJECT.DELETE,

    PERMISSIONS.EXPERIENCE.CREATE,
    PERMISSIONS.EXPERIENCE.READ,
    PERMISSIONS.EXPERIENCE.UPDATE,
    PERMISSIONS.EXPERIENCE.DELETE,

    PERMISSIONS.HERO.CREATE,
    PERMISSIONS.HERO.READ,
    PERMISSIONS.HERO.UPDATE,
    PERMISSIONS.HERO.DELETE,

    PERMISSIONS.USER.READ,

    PERMISSIONS.FILE.UPLOAD,
    PERMISSIONS.FILE.DELETE,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.BLOG.CREATE,
    PERMISSIONS.BLOG.READ,
    PERMISSIONS.BLOG.UPDATE,

    PERMISSIONS.PROJECT.READ,
    PERMISSIONS.EXPERIENCE.READ,

    PERMISSIONS.COMMENT.CREATE,
    PERMISSIONS.COMMENT.READ,
  ],

  [ROLES.USER]: [
    PERMISSIONS.BLOG.READ,
    PERMISSIONS.PROJECT.READ,
    PERMISSIONS.EXPERIENCE.READ,
    PERMISSIONS.HERO.READ,

    PERMISSIONS.COMMENT.CREATE,
    PERMISSIONS.COMMENT.READ,
  ],
};


async function main() {
  console.log("RBAC seed started...");

  for (const roleName of Object.values(ROLES)) {
    await prisma.roles.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((group) =>
    Object.values(group)
  );

  for (const perm of ALL_PERMISSIONS) {
    await prisma.permissions.upsert({
      where: { name: perm },
      update: {},
      create: {
        name: perm,
        label: perm.replace(":", " "),
      },
    });
  }

  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.roles.findUnique({
      where: { name: roleName },
    });

    if (!role) continue;

    for (const permName of perms) {
      const permission = await prisma.permissions.findUnique({
        where: { name: permName },
      });

      if (!permission) continue;

      await prisma.roles_permissions.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log("🎉 RBAC seed completed");
}


main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
