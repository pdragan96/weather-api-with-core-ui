export interface IEnvironment {

  name: string;
  production: boolean;
  baseUrl: string;
  platformDashboardURL: string;
  userKey: string;
  devEnvironment: boolean;
  useHash: boolean;
}
