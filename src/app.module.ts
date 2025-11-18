import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SignInModule } from './sign-in/sign-in.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, SignInModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}
