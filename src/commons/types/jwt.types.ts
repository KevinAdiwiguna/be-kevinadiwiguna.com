export interface JwtPayload {
  sub: bigint;
  email: string;
  role?: string;
  roleId?: bigint;
}
