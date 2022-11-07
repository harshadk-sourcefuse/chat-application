import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { AuthDataSource } from '../datasources/auth.datasource';

export interface Authservice {
  googleLogin(
    client_id: string,
    client_secret: string,
  ): Promise<void>;

  googleOauthRedirect(code: string, state: string): Promise<void>;

  authMe(token: string): Promise<Object>;

  authToken(code: string, clientId: string): Promise<Object>;

  getUsers(token: string): Promise<Object[]>;
}

export class AuthserviceProvider implements Provider<Authservice> {
  constructor(
    @inject('datasources.auth')
    protected dataSource: AuthDataSource = new AuthDataSource(),
  ) { }

  value(): Promise<Authservice> {
    return getService(this.dataSource);
  }
}
