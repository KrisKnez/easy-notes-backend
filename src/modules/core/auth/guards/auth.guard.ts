import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as cookie from 'cookie';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get the 'auth' token from the request cookie
    const cookies = cookie.parse(request.headers.cookie || '');
    const authToken = cookies.auth;

    try {
      const token = await this.authService.validateToken(authToken);

      // Set user from token into request
      request['user'] = token.user;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
