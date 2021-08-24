export type AuthData = {
  accessToken: string;
  refreshToken: string;
  expiryTime: number;
};

export interface IGAuth {
  load(): Promise<AuthData>;
  login(): Promise<AuthData>;
  logout(): Promise<void>;
  refresh(refreshToken: string): Promise<AuthData>;
}
