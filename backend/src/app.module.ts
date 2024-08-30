import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { User } from './database/tables/User';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: './tmp.sqlite',
        entities: [User],
        synchronize: true,
      }),
      AuthModule, 
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
