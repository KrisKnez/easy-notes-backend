import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

import { AuthTokenDto } from './dto/auth-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from '~/shared/services/prisma/prisma.service';
import { UserDto } from '~/modules/feature/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    userDto: UserDto;
    token: string;
  }> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) throw new UnauthorizedException(['email Unknown email']);

    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException(['password Incorrect password']);

    const userDto = UserDto.fromEntity(user);

    const token = await this.createToken(userDto);

    return {
      userDto,
      token,
    };
  }

  async register(registerDto: RegisterDto): Promise<{
    userDto: UserDto;
    token: string;
  }> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const userDto = UserDto.fromEntity(user);

    const token = await this.createToken(user);

    return {
      userDto,
      token,
    };
  }

  async createToken(userDto: UserDto): Promise<string> {
    const authToken = this.jwtService.sign({
      user: userDto,
    });

    return authToken;
  }

  async validateToken(authToken: string): Promise<AuthTokenDto> {
    const authTokenVerified = this.jwtService.verify(authToken);
    const decodedToken = new AuthTokenDto({
      user: new UserDto(authTokenVerified.user),
    });

    return decodedToken;
  }

  async refreshToken(authToken: string): Promise<string> {
    const token = await this.validateToken(authToken);
    const newAuthToken = await this.createToken(token.user);

    return newAuthToken;
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> {
    // Check if current password is correct
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!bcrypt.compareSync(changePasswordDto.currentPassword, user.password))
      throw new BadRequestException(['currentPassword Incorrect password']);

    // Process with update
    try {
      const hashedNewPassword = bcrypt.hashSync(
        changePasswordDto.newPassword,
        bcrypt.genSaltSync(10),
      );

      const user = await this.prismaService.user.update({
        data: {
          password: hashedNewPassword,
        },
        where: {
          id,
        },
      });

      return UserDto.fromEntity(user);
    } catch (e) {
      console.log(e);
    }
  }
}
