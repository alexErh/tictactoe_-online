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
    const user = await this.usersService.getAuthData(nickname);

    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Ungültige Anmeldeinformationen');
    }

    session.isLoggedIn = true;
    //in anderen Stellen (session.user.isAdmin) prüfen, ob der Nutzer die entsprechenden Rechte für einen Admin-Bereich hat.
    session.user = await this.usersService.getOne(nickname);
  }

  signOut(session: SessionData): void {
    session.isLoggedIn = undefined;
    delete session.user;
  }
}
