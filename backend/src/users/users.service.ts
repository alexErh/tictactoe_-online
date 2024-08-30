import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/tables/User';
import { CreateUserDto } from "./dto/createUserDto";
import { UpdateUserDto } from './dto/updateUserDto';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getOne(nickname: string): Promise<User> {
        const user: User = await this.userRepository.findOne({where: { nickname: nickname } });
        if (user)
            return user;
        throw new NotFoundException();
    }

    async create(createUserDto: CreateUserDto, file?: Express.Multer.File): Promise<User> {
        const newUser: User = new User();
        
        newUser.nickname = createUserDto.nickname;
        newUser.password = createUserDto.password;
        if (file)
            newUser.img = file.buffer;

        const existingUser: User = await this.userRepository.findOne({ where: { nickname: newUser.nickname } });

        if (existingUser)
            throw new ConflictException('User with this nickname already exists');


        const createdUser: User = await this.userRepository.save(newUser);

        return createdUser;
    }

    async update(updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
        const userToUpdate: User = await this.userRepository.findOne({ where: { nickname: updateUserDto.nickname } });

        if (file)
            userToUpdate.img = file.buffer;
        userToUpdate.password = updateUserDto.password;
        userToUpdate.score = updateUserDto.score;
        userToUpdate.isAdmin = updateUserDto.isAdmin;

        return await this.userRepository.save(userToUpdate);
    }
}