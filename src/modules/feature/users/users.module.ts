import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { ContactsService } from '../contacts/contacts.service';
import { PrismaService } from '~/shared/services/prisma/prisma.service';
import { AuthService } from '~/modules/core/auth/auth.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ContactsService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
