import {Body, Controller, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse} from "@nestjs/swagger";
import {Public} from "../auth/public.decorator";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post('signup')
    @ApiResponse({type: CreateUserDto})
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
