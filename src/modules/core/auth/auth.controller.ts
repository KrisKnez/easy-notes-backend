import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUser } from './types/request-with-user';
import { RegisterDto } from './dto/register.dto';
import authCookieOptions from './auth-cookie-options';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserDto } from 'modules/feature/users/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const { userDto, token } = await this.authService.login(loginDto);

    response.cookie('auth', token, {
      sameSite: 'none',
      secure: true,
    });

    response.send(userDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() response: Response) {
    const { userDto, token } = await this.authService.register(registerDto);

    response.cookie('auth', token, authCookieOptions);

    response.send(userDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Request() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<UserDto> {
    const user = request.user;

    response.cookie('auth', '', { ...authCookieOptions, expires: new Date() });

    response.send(user);

    return user;
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async ChangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() request: RequestWithUser,
  ): Promise<UserDto> {
    const user = request.user;

    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
