import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import * as cookie from 'cookie';
import { AuthTokenDto } from '../dto/auth-token.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Get the 'auth' cookie from the request
    const cookies = cookie.parse(request.headers.cookie || '');
    const authToken = cookies.auth;

    if (!authToken) {
      // If 'auth' cookie is not present, authentication fails
      throw new UnauthorizedException();
    }

    try {
      // Verify and decode the JWT
      const decodedToken: AuthTokenDto = this.jwtService.verify(authToken);

      // Added user object to the request
      request.user = decodedToken.user;

      // Allow access to the route
      return true;
    } catch (error) {
      // If JWT verification fails, authentication fails
      throw new UnauthorizedException();
    }
  }
}
