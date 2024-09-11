import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/tables/User';
import { UpdateUserDto } from './dto/updateUserDto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // für Admin gedacht, um alle useres anzusehen
  @Get()
  @ApiResponse({ type: [User] })
  async getAll(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get(':nickname')
  @ApiResponse({ type: User })
  async getOne(@Param('nickname') nickname: string): Promise<User> {
    return await this.usersService.getOne(nickname);
  }
  //Registrierung eines neuen Users
  @Public()
  @Post('signup')
  @ApiResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':nickname')
  @ApiResponse({ type: User })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() img: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.update(updateUserDto, img);
  }
}
