import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

import { ContactsService } from '../contacts/contacts.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ContactsService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
