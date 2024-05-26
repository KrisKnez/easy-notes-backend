import { Module } from '@nestjs/common';
import { NotesModule } from './modules/notes/notes.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { PrismaService } from './services/prisma/prisma.service';
import { MeModule } from './modules/me/me.module';

@Module({
  imports: [AuthModule, MeModule, UsersModule, NotesModule, ContactsModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
