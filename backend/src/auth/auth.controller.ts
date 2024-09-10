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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { SessionData } from 'express-session';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({ type: SignInDto })
  async signIn(@Session() session: SessionData, @Body() signInDto: SignInDto) {
    await this.authService.signIn(
      signInDto.username,
      signInDto.password,
      session,
    );
    return { message: 'Login successful' };
  }

  // in Frontend verwenden - Navigation wenn der Nutzer aufs Abmeldebutton clickt
  @Post('logout')
  logout(@Session() session: SessionData) {
    this.authService.signOut(session);
    return { message: 'Logout successful' };
  }

  @Get('isloggedIn')
  getProfile(@Session() session: SessionData) {
    if (!session.isLoggedIn) {
      throw new UnauthorizedException('You are not logged in');
    }
    return session.user;
  }
}
