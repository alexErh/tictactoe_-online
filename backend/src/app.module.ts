import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './database/tables/User';
import { MatchGateway } from './match/match.gateway';
import { MatchService } from './match/match.service';
import { GameModule } from './game/game.module';
import { GameEntity } from './database/tables/GameEntity';
import { ProfileModule } from './profile/profile.module';
import { AdminGuard } from './admin/admin.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        'frontend',
        'dist',
        'frontend',
        'browser',
      ),
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, GameEntity],
      synchronize: true,
      extra: {
        busyTimeout: 5000,
      },
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser'),}),
    AuthModule,
    UsersModule,
    GameModule,
    UsersModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchGateway, MatchService, AdminGuard],
})
export class AppModule {}
