import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { ResendService } from './resend/resend.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OtpModule } from './otp/otp.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { HerosModule } from './heros/heros.module';
import { ResendModule } from './resend/resend.module';

import { RateLimitController } from './rate-limit/rate-limit.controller';

import { RateLimitGuard } from './commons/guards/rate-limit.guard';
import { ExperienceModule } from './experience/experience.module';
import { SkillsModule } from './skills/skills.module';
import { TechModule } from './tech/tech.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './superuser/users/users.module';
import { RolesModule } from './superuser/roles/roles.module';
import { PermissionsModule } from './superuser/permissions/permissions.module';
import { BlogsModule } from './blogs/blogs.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [AuthModule,  PrismaModule, ResendModule,
     ConfigModule.forRoot({ 
      isGlobal: true, 
    }),
     OtpModule,
     RateLimitModule,
     HerosModule,
     ExperienceModule,
     SkillsModule,
     TechModule,
     FilesModule,
     UsersModule,
     RolesModule,
     PermissionsModule,
     BlogsModule,
     ProjectsModule,
  ],
  controllers: [RateLimitController],
  providers: [PrismaService, AuthService, ResendService, RefreshTokenService, RateLimitGuard],
  exports: [RateLimitGuard]
})
export class AppModule {}
