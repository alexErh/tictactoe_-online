import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from './database/tables/GameEntity';
import { User } from './database/tables/User';
import { users } from './database/demo_data/user';
import { games } from './database/demo_data/game';
import { readFileSync } from 'fs';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        
    }
    
    async onModuleInit() {
        await Promise.all(
            users.map(async user => {
                user.img = readFileSync('src/assets/portrait.jpg');
                const savedUser = await this.userRepository.save(user);
            })
        );
        

        await Promise.all(
            games.map(async game => {
                await this.gameRepository.save(game);
            })
        )
    }
}
