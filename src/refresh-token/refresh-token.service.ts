import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenPromiseResponse } from 'src/commons/types/auth-response.types';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createRefreshToken(userId: bigint) {
    const token = randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    return this.prisma.refresh_tokens.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenPromiseResponse> {
    const tokenRecord = await this.prisma.refresh_tokens.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const user = tokenRecord.user;

    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role?.name,
      roleId: user.roleId?.toString(),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30s',
    });

    const newRefreshToken = await this.createRefreshToken(user.id);

    await this.prisma.refresh_tokens.update({
      where: { id: tokenRecord.id },
      data: {
        revoked: true,
        replacedById: newRefreshToken.id,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
      refreshTokenExpiresAt: newRefreshToken.expiresAt.toISOString(),
    };
  }

  async validateToken(refreshToken: string) {
    const tokenRecord = await this.prisma.refresh_tokens.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expiresAt < new Date()
    ) {
      return null;
    }

    return tokenRecord;
  }
}
