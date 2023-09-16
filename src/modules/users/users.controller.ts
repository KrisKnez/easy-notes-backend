import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { RetrieveUserDto } from './dto/retrieve-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<RetrieveUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query() filterUserDto: FilterUserDto,
  ): Promise<RetrieveUserDto[]> {
    return await this.usersService.findAll(filterUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RetrieveUserDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<RetrieveUserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RetrieveUserDto> {
    return this.usersService.remove(+id);
  }
}
