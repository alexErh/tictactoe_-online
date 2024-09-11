import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Game } from 'src/database/tables/Game';
import { User } from '../database/tables/User';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiResponse({
    description: 'Retrieve all users.',
    type: [User],
  })
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Get('games')
  @ApiResponse({
    description: 'Retrieve all games.',
    type: [Game],
  })
  async getAllGames(): Promise<Game[]> {
    return this.adminService.getAllGames();
  }

  @Get('queue')
  @ApiResponse({
    description: 'Retrieve the matchmaking queue.',
    type: [Game],
  })
  async getQueue(): Promise<Game[]> {
    return this.adminService.getQueue();
  }
}
