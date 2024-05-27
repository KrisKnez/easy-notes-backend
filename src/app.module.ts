import { Module } from '@nestjs/common';
import { UsersModule } from './modules/feature/users/users.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { MeModule } from './modules/core/me/me.module';
import { NotesModule } from './modules/feature/notes/notes.module';
import { ContactsModule } from './modules/feature/contacts/contacts.module';

@Module({
  imports: [AuthModule, MeModule, UsersModule, NotesModule, ContactsModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
