import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { VerifyEmailDto } from 'src/otp/dto/verify-email.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { RateLimitService } from 'src/rate-limit/rate-limit.service';
import { ResendService } from 'src/resend/resend.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private resend: ResendService,
    private rateLimit: RateLimitService
  ) { }

  @UseGuards(JwtAuthGuard)
  async requestEmailVerification(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    if (user.emailVerified)
      throw new BadRequestException('Email already verified');

    await this.prisma.verification_codes.updateMany({
      where: { userId: user.id, context: 'email_verification', used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.verification_codes.create({
      data: {
        userId: user.id,
        code,
        context: 'email_verification',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.resend.sendOtpEmail(email, code);

    return { message: 'Verification code sent' };
  }

  @UseGuards(JwtAuthGuard)
  async verifyEmail(email, dto: VerifyEmailDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (!user) throw new NotFoundException('User not found');

    const record = await this.prisma.verification_codes.findFirst({
      where: {
        userId: user.id,
        code: dto.code,
        context: 'email_verification',
        used: false, 
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) throw new BadRequestException('Invalid or expired code');

    await this.prisma.verification_codes.update({
      where: { id: record.id },
      data: { used: true },
    });

    await this.prisma.users.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    return { message: 'Email verified successfully' };
  }
}
