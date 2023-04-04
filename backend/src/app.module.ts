import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignupController } from './routes/auth/signup/signup.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { LoginController } from './routes/auth/login/login.controller';
import { MeController } from './routes/auth/me/me.controller';
import { QuestionsController } from './routes/questions/questions.controller';
import { StaticController } from './routes/static/static.controller';
import { SearchController } from './routes/search/search.controller';
import { DashboardController } from './routes/dashboard/dashboard.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    AppController,
    SignupController,
    LoginController,
    MeController,
    QuestionsController,
    StaticController,
    SearchController,
    DashboardController,
  ],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
