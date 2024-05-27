import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeNotesController } from './me-notes.controller';
import { MeContactsController } from './me-contacts.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'shared/services/prisma/prisma.service';
import { UsersService } from 'modules/feature/users/users.service';
import { NotesService } from 'modules/feature/notes/notes.service';
import { ContactsService } from 'modules/feature/contacts/contacts.service';

@Module({
  imports: [AuthModule],
  controllers: [MeController, MeNotesController, MeContactsController],
  providers: [
    PrismaService,
    AuthService,
    UsersService,
    NotesService,
    ContactsService,
  ],
})
export class MeModule {}
