import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import * as cookie from 'cookie';
import { plainToClass } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user';
import authCookieOptions from '../auth/auth-cookie-options';
import { UsersService } from '~/modules/feature/users/users.service';
import { UserDto } from '~/modules/feature/users/dto/user.dto';
import { UpdateUserDto } from '~/modules/feature/users/dto/update-user.dto';

@Controller('me')
@ApiTags('me')
export class MeController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async me(@Request() request): Promise<UserDto | null> {
    // Get the 'auth' token from the request cookie
    const cookies = cookie.parse(request.headers.cookie || '');
    const authToken = cookies.auth;

    try {
      const token = await this.authService.validateToken(authToken);

      return token.user;
    } catch (e) {
      return null;
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @Request() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<UserDto> {
    const user = request.user;

    const newUser = plainToClass(
      UserDto,
      await this.userService.update(user.id, updateUserDto),
    );

    const token = await this.authService.createToken(newUser);

    response.cookie('auth', token, authCookieOptions);

    response.send(plainToClass(UserDto, newUser));

    return newUser;
  }
}
