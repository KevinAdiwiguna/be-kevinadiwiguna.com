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
  // Done
  AUTH: {
    SIGNIN: 'auth:signin',
    SIGNUP: 'auth:signup',
    SIGNOUT_SINGLE: 'auth:signout_single',
    SIGNOUT_ALL: 'auth:signout_all',
  },

  // Done
  OTP: {
    SEND_OTP: 'otp:send_otp',
    VERIFY_OTP: 'otp:verify_otp',
  },

  // Done
  USERS: {
    READ: 'users:read',
    READ_ID: 'users:read_id',
    UPDATE_ROLE: 'users:update_role',
    DELETE: 'users:delete',
    VERIFY: 'users:verify',
  },

  // Done
  TECH: {
    CREATE: 'tech:create',
    READ: 'tech:read',
    READ_ID: 'tech:read_id',
    UPDATE: 'tech:update',
    DELETE: 'tech:delete',
  },

  // Done
  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    READ_ID: 'roles:read_id',
    UPDATE_PERMISSIONS: 'roles:update_permissions',
    DELETE: 'roles:delete',
  },

  // Done
  PERMISSIONS: {
    READ: 'permission:read',
  },

  // Done
  HEROS: {
    CREATE: 'hero:create',
    READ: 'hero:read',
    READ_ID: 'hero:read_id',
    UPDATE: 'hero:update',
    DELETE: 'hero:delete',
    SET_PRIMARY: 'hero:set_primary',
  },

  // SKILL: {
  //   CREATE: 'skill:create',
  //   READ: 'skill:read',
  //   READ_ID: 'skill:read_id',
  //   UPDATE: 'skill:update',
  //   DELETE: 'skill:delete',
  // },

  // Done
  FILE: {
    READ: 'file:read',
    UPLOAD: 'file:upload',
    UPLOAD_MANY: 'file:upload_many',
    DELETE: 'file:delete',
  },

  EXPERIENCE: {
    READ_ID: 'experience:read_id',
    CREATE: 'experience:create',
    UPDATE: 'experience:update',
    DELETE: 'experience:delete',
  },
  // Done
  BLOGS: {
    CREATE: 'blog:create',
    READ_OWN: 'blog:read_own',
    UPDATE_STATUS: 'blog:update_status',
    DELETE: 'blog:delete',
  },

  // Done
  PROJECTS: {
    CREATE: 'project:create',
    READ_OWN: 'project:read_own',
    READ_ALL: 'project:read_all',
    READ_FEATURED: 'project:read_featured',
    UPDATE_PUBLISH: 'project:publish',
    DELETE: 'project:delete',
    UPDATE_FEATURED: 'project:update_featured',
  },
} as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPERADMIN]: flattenPermissions(PERMISSIONS),

  [ROLES.ADMIN]: [],

  [ROLES.EDITOR]: [],

  [ROLES.USER]: [],
};

async function main() {
  await prisma.heroes.create({
    data: {
      title: 'Kevin Adiwiguna',
      description:
        '<p>Passionate <span style="color: lab(71.5903 -21.6132 -39.8504);"><strong>Web &amp; Mobile Developer</strong></span> with 3+ years of professional experience. Specializing in creating innovative solutions using modern technologies. Proven track record of delivering high-quality digital experiences.</p>',
      isPrimary: true,
      cvLink:
        'https://drive.google.com/uc?export=download&id=1h1b0k1bXK3v1Yt4a5b6c7d8e9f0g1h2i',
      githubLink: 'https://github.com/kevinadiwiguna',
      phoneNumber: '085253711498',
      imageUrl: 'https://cdn.kevinadiwiguna.com/uploads/me.jpg',
    },
  });
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

  const ownerId = BigInt(1);

  await prisma.experiences.createMany({
    data: [
      {
        companyName: 'Unboxlabs.id',
        role: 'Frontend Developer',
        description:
          "Unboxlabs.id is a web technology bootcamp that has successfully developed various landing pages, increasing user engagement and attracting new clients, thereby expanding Unboxlabs' reach.",
        image: 'https://cdn.kevinadiwiguna.com/experiences/unbxlabs.png',
        url: 'https://www.unboxlabs.id',
        durationMonths: 8,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-08-31'),
        ownerId,
      },
      {
        companyName: 'Sebarin.id',
        role: 'Frontend Developer',
        description:
          'Managed and optimized digital invitation templates to enhance usability and client satisfaction. Successfully maintained product functionality with stable performance for users.',
        image: 'https://cdn.kevinadiwiguna.com/experiences/sebarin.jpg',
        url: 'https://www.sebarin.id',
        durationMonths: 1,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-09-30'),
        ownerId,
      },
      {
        companyName: 'cloudgakkai',
        role: 'Frontend Developer',
        description:
          "Contributed to showcasing innovative products in the technology and creative industries. Led a software engineering team to complete projects on time and within budget, achieving high levels of client satisfaction. Developed the product 'Sebarin' from concept to launch and presented the project outcomes as the Team Leader.",
        image: 'https://cdn.kevinadiwiguna.com/experiences/cloudgakkai.jpg',
        url: 'https://www.cloudgakkai.com',
        durationMonths: 16,
        startDate: new Date('2021-09-01'),
        endDate: new Date('2022-12-31'),
        ownerId,
      },
      {
        companyName: 'fullstacklombok',
        role: 'Frontend Developer',
        description:
          "Assisted clients in emergency situations, ensuring they received timely technical support. Contributed to the design and performance enhancements of Full Stack Lombok's website landing page, making it more visually appealing and responsive. Actively built relationships with schools to introduce and promote our software services.",
        image: 'https://cdn.kevinadiwiguna.com/experiences/fullstacklombok.png',
        url: 'https://www.fullstacklombok.com',
        durationMonths: 4,
        startDate: new Date('2023-10-01'),
        endDate: new Date('2024-01-31'),
        ownerId,
      },
      {
        companyName: 'Nusantaradata.com',
        role: 'Frontend Developer',
        description:
          'Jakarta, Indonesia. Developed innovative digital solutions to streamline budget data collection and management for government operations. Contributed to the creation of a responsive web-based system that allows accurate tracking, recording, and reporting of government expenditure, thereby improving transparency and efficiency in public service delivery.',
        image: 'https://cdn.kevinadiwiguna.com/experiences/nusantaradata.png',
        url: 'https://www.nusantaradata.com',
        durationMonths: 3,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-04-30'),
        ownerId,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
