import {
  Controller,
  UseGuards,
  Get,
  Request,
  Res,
  Body,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/entities/request-with-user';
import { RetrieveUserDto } from './dto/retrieve-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { plainToClass } from 'class-transformer';

@ApiTags('users-me')
@Controller('users/me')
@UseGuards(AuthGuard)
export class UsersMeController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async me(@Request() request: RequestWithUser): Promise<RetrieveUserDto> {
    const user = request.user;

    return user;
  }

  @Patch()
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

    const token = await this.authService.refresh(newUser);

    response.cookie('auth', token);

    response.send(plainToClass(RetrieveUserDto, newUser));

    return newUser;
  }
}
