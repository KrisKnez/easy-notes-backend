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
import { plainToClass } from 'class-transformer';
import { RetrieveUserDto } from '../users/dto/retrieve-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUser } from './entities/request-with-user';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const { user, token } = await this.authService.login(loginDto);

    response.cookie('auth', token, {
      sameSite: 'none',
    });

    response.send(plainToClass(RetrieveUserDto, user));
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() response: Response) {
    const { user, token } = await this.authService.register(registerDto);

    response.cookie('auth', token);

    response.send(plainToClass(RetrieveUserDto, user));
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Request() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<RetrieveUserDto> {
    const user = request.user;

    response.cookie('auth', '', {
      expires: new Date(),
    });

    response.send(user);

    return user;
  }
}
