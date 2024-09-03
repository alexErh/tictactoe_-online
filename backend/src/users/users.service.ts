import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/tables/User';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

@Injectable()
export class UsersService {
  avatar_placeholder_path: string = 'src/assets/avatar_placeholder.jpeg';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // Dummy data for testing
  // TODO: Replace it with database methods
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
    {
      userId: 3,
      username: 'Dunia',
      password: 'Dunia',
    },
  ];

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOne(nickname: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  async create(
    createUserDto: CreateUserDto,
    img?: Express.Multer.File,
  ): Promise<User> {
    const newUser: User = new User();

    newUser.nickname = createUserDto.nickname;
    newUser.password = createUserDto.password;
    newUser.img = img ? img.buffer : readFileSync(this.avatar_placeholder_path); // Saving avatar placeholder if image wasn't uploaded

    const existingUser: User = await this.userRepository.findOne({
      where: { nickname: newUser.nickname },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with nickname ${existingUser.nickname} already exists`,
      );
    }

    const createdUser: User = await this.userRepository.save(newUser);
    return createdUser;
  }

  async update(
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const userToUpdate: User = await this.userRepository.findOne({
      where: { nickname: updateUserDto.nickname },
    });

    if (!userToUpdate) {
      throw new NotFoundException(
        `User with nickname ${updateUserDto.nickname} not found`,
      );
    }

    if (file) {
      userToUpdate.img = file.buffer;
    }
    userToUpdate.password = updateUserDto.password;
    userToUpdate.score = updateUserDto.score;
    userToUpdate.isAdmin = updateUserDto.isAdmin;

    return await this.userRepository.save(userToUpdate);
  }

  async findUserByNickname(nickname: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { nickname } });
  }
}
