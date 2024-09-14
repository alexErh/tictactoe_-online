import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SessionData } from 'express-session';
import { ReturnUserDto } from 'src/users/dto/returnUserDto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(
    nickname: string,
    pass: string,
    session: SessionData,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.getAuthData(nickname);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Ungültige Anmeldeinformationen');
    }
    session.isLoggedIn = true;
    session.user = {nickname: user.nickname, isAdmin: user.isAdmin || false}
    //in anderen Stellen (session.user.isAdmin) prüfen, ob der Nutzer die entsprechenden Rechte für einen Admin-Bereich hat.
    return await this.usersService.getOne(nickname);
  }

  signOut(session: SessionData): void {
    session.isLoggedIn = undefined;
  }

  async getMe(session: SessionData): Promise<ReturnUserDto> {
    if (session.isLoggedIn && session.user.nickname)
      return await this.usersService.getOne(session.user.nickname);
    throw new UnauthorizedException('Ungültige Anmeldeinformationen');
  }
}
