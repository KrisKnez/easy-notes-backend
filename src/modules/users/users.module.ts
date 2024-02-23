import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';
import { NotesService } from '../notes/notes.service';
import { UsersContactsController } from './users-contacts.controller';
import { ContactsService } from '../contacts/contacts.service';
import { UsersMeController } from './users-me.controller';
import { AuthService } from '../auth/auth.service';
import { UsersMeNotesController } from './users-me-notes.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'asd',
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [
    UsersMeNotesController,
    UsersContactsController,
    UsersMeController,
    UsersController,
  ],
  providers: [
    UsersService,
    PrismaService,
    NotesService,
    ContactsService,
    AuthService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
