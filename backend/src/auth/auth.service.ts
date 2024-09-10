import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SessionData } from 'express-session';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(
    nickname: string,
    pass: string,
    session: SessionData,
  ): Promise<void> {
    const user = await this.usersService.getOne(nickname);

    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Ungültige Anmeldeinformationen');
    }

    session.isLoggedIn = true;
    session.user = { nickname: user.nickname, isAdmin: user.isAdmin || false };
  }

  signOut(session: SessionData): void {
    session.isLoggedIn = undefined;
    delete session.user;
  }
}
