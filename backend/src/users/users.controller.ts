import {Body, Controller, Get, Param, Post, Put, UnauthorizedException, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import { Public } from 'src/auth/public.decorator';
import { ReturnUserDto } from './dto/returnUserDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { UpdateToAdminDto } from './dto/updateToAdminDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Get("all/:nickname")
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
        const user = await this.usersService.getOne(nickname);
        return user;
    }

    @Public()
    @Post("signup")
    @UseInterceptors(FileInterceptor('img'))
    @ApiResponse({type: ReturnUserDto})
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile() img: Express.Multer.File): Promise<ReturnUserDto>{
        return await this.usersService.create(createUserDto, img);
    }

    @Put("img/:nickname")
    @UseInterceptors(FileInterceptor('img'))
    @ApiResponse({type: ReturnUserDto})
    async updateImg(@Param("nickname") nickname: string, @UploadedFile() img: Express.Multer.File): Promise<ReturnUserDto> {
        return await this.usersService.updateImg(nickname, img);
    }

    @Put("updatePW")
    @ApiResponse({type: ReturnUserDto})
    async updatePassword(@Body() data: UpdatePasswordDto): Promise<ReturnUserDto> {
        return await this.usersService.updatePW(data);
    }

    @Put("setAdmin")
    @ApiResponse({type: ReturnUserDto})
    async updateToAdmin(@Body() updateToAdminDto: UpdateToAdminDto): Promise<ReturnUserDto> {
        if(await this.usersService.isAdmin(updateToAdminDto.adminNickname))
            return await this.usersService.updateToAdmin(updateToAdminDto.nickname);
        else
            throw new UnauthorizedException('You are not admin');
    }
}
