import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/tables/User';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateScoreDto } from './dto/updateScoreDto';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { ReturnUserDto } from './dto/returnUserDto';
import { AuthDataDto } from './dto/authDataDto';
import { UpdatePasswordDto } from './dto/updatePasswordDto';

@Injectable()
export class UsersService {
  avatar_placeholder_path: string = 'src/assets/portrait.jpg';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAuthData(nickname: string): Promise<AuthDataDto> {
    const user = await this.userRepository.findOne({ where: { nickname: nickname }});
    return {
      id: user.id,
      nickname: user.nickname,
      password: user.password,
      isAdmin: user.isAdmin
    }
  }

  async getAll(): Promise<ReturnUserDto[]> {
    return (await this.userRepository.find()).map(e => {
      return this.returnUser(e)
    });
  }


  async getOne(nickname: string): Promise<ReturnUserDto> {
    const user: User = await this.userRepository.findOne({
      where: {nickname: nickname}
    });
    if (!user)
      throw new NotFoundException();
    else
      return this.returnUser(user);
  }

    async create(createUserDto: CreateUserDto, img?: Express.Multer.File): Promise<ReturnUserDto> {
        const newUser: User = new User();
        
        newUser.nickname = createUserDto.nickname;
        newUser.password = createUserDto.password;
        newUser.img =  img ? img.buffer : readFileSync(this.avatar_placeholder_path); //saving avatar placeholder if image was't uploaded

    const existingUser: User = await this.userRepository.findOne({
      where: { nickname: newUser.nickname },
    });

    if (existingUser)
      throw new ConflictException(`User with nickname ${existingUser.nickname} already exists`);

    const createdUser: User = await this.userRepository.save(newUser);
    return this.returnUser(createdUser)
  }

  async updateScore(updateUserDto: UpdateScoreDto): Promise<ReturnUserDto> {
    const userToUpdate: User = await this.userRepository.findOne({
      where: { nickname: updateUserDto.nickname }
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with nickname ${updateUserDto.nickname} not found`);
    }

    userToUpdate.score = updateUserDto.score;

    const updatedUser = await this.userRepository.save(userToUpdate);
    return this.returnUser(updatedUser);
  }

  async updatePW(data: UpdatePasswordDto): Promise<ReturnUserDto> {
    const user: User = await this.userRepository.findOne({
      where: { nickname: data.nickname }
    });

    if(!user)
      throw new NotFoundException(`User with nickname ${data.nickname} not found`);
    else if(user.password !== data.oldPW)
      throw new ConflictException('The old password is false.');
    else {
      user.password = data.newPW;
      return this.returnUser(user);
    }
  }

  async updateImg(nickname: string, img: Express.Multer.File): Promise<ReturnUserDto> {
    const userToUpdate: User = await this.userRepository.findOne({
      where: { nickname: nickname }
    });

    userToUpdate.img = img.buffer;

    return this.returnUser(await this.userRepository.save(userToUpdate));
  }

  async updateToAdmin(nickname: string): Promise<ReturnUserDto> {
    const userToUpdate: User = await this.userRepository.findOne({
      where: { nickname: nickname }
    });
    userToUpdate.isAdmin = true;
    return this.returnUser(await this.userRepository.save(userToUpdate))
  }

  async isAdmin(nickname: string): Promise<boolean> {
    return (await this.userRepository.findOne({ where: { nickname: nickname }})).isAdmin;
  }

  private returnUser(user: User): ReturnUserDto {
    const base64Image = user.img.toString('base64');
    return {
      id: user.id,
      nickname: user.nickname,
      score: user.score,
      img: base64Image,
      isAdmin: user.isAdmin
    };
  }
}
