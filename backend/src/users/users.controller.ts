import {Body, Controller, Get, Param, Post, Put, UnauthorizedException, UploadedFile} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import { UpdateUserDto } from './dto/updateUserDto';
import { Public } from 'src/auth/public.decorator';
import { ReturnUserDto } from './dto/returnUserDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":nickname")
    @ApiResponse({type: [ReturnUserDto]})
    async getAll(@Param("nickname") nickname: string): Promise<ReturnUserDto[]>{
        if (await this.usersService.isAdmin(nickname))
            return await this.usersService.getAll();
        else
            throw new UnauthorizedException('You are not admin');
    }

    @Get(":nickname")
    @ApiResponse({type: ReturnUserDto})
    async getOne(@Param("nickname") nickname: string): Promise<ReturnUserDto>{
        return await this.usersService.getOne(nickname);
    }

    @Public()
    @Post("signup")
    @ApiResponse({type: ReturnUserDto})
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile() img: Express.Multer.File): Promise<ReturnUserDto>{
        return await this.usersService.create(createUserDto, img);
    }

    @Put(":nickname")
    @ApiResponse({type: ReturnUserDto})
    async update(@Body() updateUserDto: UpdateUserDto, @UploadedFile() img: Express.Multer.File): Promise<ReturnUserDto> {
        return await this.update(updateUserDto, img);
    }
}
