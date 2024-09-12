import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/database/tables/Game';
import { User } from '../database/tables/User';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .where('game.player1 IS NOT NULL')
      .andWhere('game.player2 IS NOT NULL')
      .getMany();
  }

  async getQueue(): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .where('game.player2 IS NULL')
      .getMany();
  }
}
