import { PrismaClient } from '../generated/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
} as const;

const ACTIONS = ['create', 'read', 'update', 'delete'] as const;
type Action = (typeof ACTIONS)[number];

const CRUD = (resource: string) =>
  Object.fromEntries(
    ACTIONS.map((a) => [a.toUpperCase(), `${resource}:${a}`]),
  ) as Record<Uppercase<Action>, string>;

const flattenPermissions = (obj: Record<string, any>): string[] =>
  Object.values(obj).flatMap((v) =>
    typeof v === 'string' ? v : Object.values(v),
  );

const PERMISSIONS = {
  AUTH: {
    SIGNIN: 'auth:signin',
    SIGNUP: 'auth:signup',
    SIGNOUT_SINGLE: 'auth:signout_single',
    SIGNOUT_ALL: 'auth:signout_all',
  },

  OTP: {
    SEND_OTP: 'otp:send_otp',
    VERIFY_OTP: 'otp:verify_otp',
  },

  USERS: {
    READ: 'users:read',
    READ_ID: 'users:read_id',
    UPDATE_ROLE: 'users:update_role',
    DELETE: 'users:delete',
    VERIFY: 'users:verify',
  },

  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    READ_ID: 'roles:read_id',
    UPDATE_PERMISSIONS: 'roles:update_permissions',
    DELETE: 'roles:delete',
  },

  PERMISSIONS: {
    READ: 'permission:read',
  },

  SKILL: {
    CREATE: 'skill:create',
    UPDATE: 'skill:update',
    DELETE: 'skill:delete',
  },

  FILE: {
    UPLOAD: 'file:upload',
    DELETE: 'file:delete',
  },
} as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPERADMIN]: flattenPermissions(PERMISSIONS),

  [ROLES.ADMIN]: [],

  [ROLES.EDITOR]: [],

  [ROLES.USER]: [],
};

async function main() {
  for (const roleName of Object.values(ROLES)) {
    await prisma.roles.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  const ALL_PERMISSIONS = Array.from(new Set(flattenPermissions(PERMISSIONS)));

  for (const perm of ALL_PERMISSIONS) {
    await prisma.permissions.upsert({
      where: { name: perm },
      update: {},
      create: {
        name: perm,
        label: perm
          .split(':')
          .map((s) => s.replace('_', ' '))
          .join(' → '),
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

  const userRole = await prisma.roles.findUnique({
    where: { name: ROLES.USER },
  });

  if (userRole) {
    const password = await bcrypt.hash('admin123', 10);

    const users = [
      {
        email: 'admin1@mail.com',
        name: 'admin1',
        roleId: 1,
      },
      {
        email: 'admin2@mail.com',
        name: 'admin2',
        roleId: 1,
      },
      {
        email: 'admin3@mail.com',
        name: 'admin3',
        roleId: 4,
      },
    ];

    await Promise.all(
      users.map((user) =>
        prisma.users.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            name: user.name,
            password,
            roleId: user.roleId,
            emailVerified: new Date(),
          },
        }),
      ),
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
