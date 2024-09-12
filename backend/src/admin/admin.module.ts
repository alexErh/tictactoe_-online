import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../database/tables/Game';
import { User } from '../database/tables/User';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User]), UsersModule],
  controllers: [AdminController],
  providers: [AdminGuard, AuthService, AdminService],
  exports: [AdminGuard],
})
export class AdminModule {}
