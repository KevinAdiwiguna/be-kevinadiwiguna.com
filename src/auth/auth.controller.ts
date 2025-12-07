import { Controller, Post, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// Dto
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

import { JwtAuthGuard } from './jwt-auth.guard';

import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }


  @Post("signin")
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.signIn(data);

    response.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 48,
      path: "/",
    });


    response.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 30,
    })


    response.cookie("refreshTokenExpiresAt", result.refreshTokenExpiresAt, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 48,
    })

    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
      refreshTokenExpiresAt: result.refreshTokenExpiresAt,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const res = await this.authService.refreshAccessToken(refreshToken);
    response.cookie('refreshToken', res.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 86400 * 1000 * 2,
    });

    response.cookie('accessToken', res.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 30,
    });

    response.cookie('refreshTokenExpiresAt', res.refreshTokenExpiresAt, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 48,
    });

    return { 
      accessToken: res.accessToken,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {

    const token = req.cookies['refreshToken'];

    if (token) {
      await this.authService.revokeRefreshToken(token);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req: any, @Res({ passthrough: true }) res: Response,) {
    const userId = req.user.sub;

    await this.authService.revokeUserRefreshTokens(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Logged out from all devices' };
  }
}
