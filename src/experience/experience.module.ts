import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';

import { RateLimitModule } from 'src/rate-limit/rate-limit.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [RateLimitModule],
  controllers: [ExperienceController],
  providers: [ExperienceService, PrismaService],
})
export class ExperienceModule {}
