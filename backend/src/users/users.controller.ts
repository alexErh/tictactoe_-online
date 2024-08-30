import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse} from "@nestjs/swagger";
import { User } from 'src/database/tables/User';
import { UpdateUserDto } from './dto/updateUserDto';
import { Public } from 'src/auth/public.decorator';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiResponse({type: [User]})
    async getAll(): Promise<User[]>{
        return await this.usersService.getAll();
    }

    @Get(":nickname")
    @ApiResponse({type: User})
    async getOne(@Param("nickname") nickname: string): Promise<User>{
        return await this.usersService.getOne(nickname);
    }

    @Public()
    @Post("signup")
    @ApiResponse({type: User})
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile() img: Express.Multer.File): Promise<User>{
        return await this.usersService.create(createUserDto);
    }

    @Put(":nickname")
    @ApiResponse({type: User})
    async update(@Body() updateUserDto: UpdateUserDto, @UploadedFile() img: Express.Multer.File): Promise<User> {
        return await this.update(updateUserDto, img);
    }
}
