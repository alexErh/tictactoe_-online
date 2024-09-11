import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
  providers: [AdminGuard, AuthService],
  exports: [AdminGuard],
})
export class AdminModule {}
