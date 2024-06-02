import { Module } from '@nestjs/common';
import { UsersModule } from './modules/feature/users/users.module';
import { AuthModule } from './modules/core/auth/auth.module';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { MeModule } from './modules/core/me/me.module';
import { NotesModule } from './modules/feature/notes/notes.module';
import { ContactsModule } from './modules/feature/contacts/contacts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    MeModule,
    UsersModule,
    NotesModule,
    ContactsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'node_modules/swagger-ui-dist'),
      serveRoot: '/api',
    }),
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
