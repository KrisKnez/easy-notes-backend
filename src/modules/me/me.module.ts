import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { MeNotesController } from './me-notes.controller';
import { NotesService } from '../notes/notes.service';
import { MeContactsController } from './me-contacts.controller';
import { ContactsService } from '../contacts/contacts.service';

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
