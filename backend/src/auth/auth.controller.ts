//Endpunkte verwalten für die Authentifizierung
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { SessionData } from 'express-session';
import { ReturnUserDto } from 'src/users/dto/returnUserDto';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({ type: ReturnUserDto })
  async signIn(@Session() session: SessionData, @Body() signInDto: SignInDto) {
    const user = await this.authService.signIn(
      signInDto.nickname,
      signInDto.password,
      session,
    );
    return user;
  }

  @Post('logout')
  logout(@Session() session: SessionData) {
    console.log('logout', session);
    this.authService.signOut(session);
    return { message: 'Logout successful' };
  }

  @Get('me')
  @ApiResponse({ type: ReturnUserDto })
  async getMe(@Session() session: SessionData) {
    return this.authService.getMe(session);
  }


}
