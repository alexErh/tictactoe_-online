import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [AdminController],
  providers: [AdminGuard, AuthService],
})
export class AdminModule {}
