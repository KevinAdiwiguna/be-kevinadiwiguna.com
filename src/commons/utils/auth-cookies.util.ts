import { Response } from 'express';

export function setAuthCookies(
  res: Response,
  data: {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  },
) {
  const isProd = process.env.NODE_ENV === 'production';

  const baseOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  };

  res.cookie('refreshToken', data.refreshToken, {
    ...baseOptions,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', data.accessToken, {
    ...baseOptions,
    maxAge: 30 * 1000,
  });

  res.cookie('refreshTokenExpiresAt', data.refreshTokenExpiresAt, {
    ...baseOptions,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
}
