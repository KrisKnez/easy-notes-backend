import {
  Controller,
  UseGuards,
  Get,
  Request,
  Res,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import * as cookie from 'cookie';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestWithUser } from '../auth/entities/request-with-user';
import { RetrieveUserDto } from './dto/retrieve-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { plainToClass } from 'class-transformer';
import authCookieOptions from '../auth/auth-cookie-options';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users-me')
@Controller('users/me')
export class UsersMeController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async me(@Request() request): Promise<RetrieveUserDto | null> {
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
  ): Promise<RetrieveUserDto> {
    const user = request.user;

    const newUser = plainToClass(
      RetrieveUserDto,
      await this.userService.update(user.id, updateUserDto),
    );

    const token = await this.authService.createToken(newUser);

    response.cookie('auth', token, authCookieOptions);

    response.send(plainToClass(RetrieveUserDto, newUser));

    return newUser;
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async ChangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveUserDto> {
    const user = request.user;

    return this.userService.changePassword(user.id, changePasswordDto);
  }
}
