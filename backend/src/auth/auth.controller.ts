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


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({ type: SignInDto })
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

}
