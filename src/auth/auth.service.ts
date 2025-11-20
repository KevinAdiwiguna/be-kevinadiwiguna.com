import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { SignUpPromiseResponse } from 'src/types/auth-response.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private refreshToken: RefreshTokenService
  ) { }

  async signIn(data: SignInDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: data.email },
      include: { role: true },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
      roleId: user.roleId
    };
    
    // const accessToken = await this.jwtService.signAsync(payload);
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30s' });

    const refreshToken = await this.refreshToken.createRefreshToken(user.id);

    const { password, ...safeUser } = user;

    return {
      message: 'Signed in successfully',
      user: safeUser,
      accessToken,
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt.toISOString(),
    };
  }

  async signUp(data: SignUpDto): Promise<SignUpPromiseResponse> {
    const getExistingUser = await this.prisma.users.findUnique({
      where: {
        email: data.email
      }
    })

    if (getExistingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hash = await bcrypt.hash(data.password, 10)

    const userRole = await this.prisma.roles.findUnique({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new BadRequestException('Default role not found. please contact the developer.');
    }

    const user = await this.prisma.users.create({
      data: {
        email: data.email,
        password: hash,
        name: data.name ?? null,
        roleId: userRole.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: { select: { name: true } },
        createdAt: true,
      },
    });

    return user;
  }

  async refreshAccessToken(oldToken: string) {
    return this.refreshToken.refreshAccessToken(oldToken)
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refresh_tokens.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeUserRefreshTokens(userId: bigint) {
    await this.prisma.refresh_tokens.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
