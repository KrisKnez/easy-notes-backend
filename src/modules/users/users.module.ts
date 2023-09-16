import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UsersNotesController } from './users-notes.controller';

import { JwtModule } from '@nestjs/jwt';
import { NotesService } from '../notes/notes.service';
import { UsersContactsController } from './users-contacts.controller';
import { ContactsService } from '../contacts/contacts.service';
import { UsersMeController } from './user-me.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'asd',
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [
    UsersNotesController,
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
