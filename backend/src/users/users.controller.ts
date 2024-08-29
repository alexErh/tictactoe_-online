import {Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse} from "@nestjs/swagger";
import { User } from 'src/database/tables/User';


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

    @Post()
    @ApiResponse({type: CreateUserDto})
    create(@Body() createUserDto: CreateUserDto, @UploadedFile() img: Express.Multer.File): Promise<User>{
        return this.usersService.create(createUserDto);
    }
}
