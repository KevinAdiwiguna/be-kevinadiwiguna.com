export interface AuthUser {
  id: bigint;
  email: string;
  name: string | null;
  role: { name: string };
  createdAt: Date;
}

export interface SignUpResponse {
  message: string;
  user: AuthUser;
}

export interface SignInResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}


export interface SignUpPromiseResponse {
  id: bigint;
  email: string;
  name: string | null;
  createdAt: Date;
  role: {
    name: string;
  } | null;
}

export interface RefreshTokenPromiseResponse {  
  accessToken: string;
  refreshToken: String;
  refreshTokenExpiresAt: String;
}


export interface SignInPromiseResponse {
  message: string,
  user: {
    role: {
      id: bigint;
      name: string;
      createdAt: Date;
    } | null;
    id: bigint;
    email: string;
    name: string | null;
    emailVerified: Date | null;
    isDisabled: boolean;
    roleId: bigint | null;
    createdAt: Date;
    updatedAt: Date;
  }
  accessToken: string,
  refreshToken: string,
  refreshTokenExpiresAt: string,
}