import { Injectable } from '@nestjs/common';
import {CreateUserDto} from "./dto/createUserDto";

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    // dummy data for testing
    // todo replace it with database methods
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
        },
    ];

    async create(createUserDto: CreateUserDto): Promise<User | undefined> {
        const existingUser = this.users.find(user => user.username === createUserDto.nickname);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        const newUser = {
            userId: this.users.length + 1,
            username: createUserDto.nickname,
            password: createUserDto.password,
        };
        this.users.push(newUser);
        return newUser;
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}