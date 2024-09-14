import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SessionData } from 'express-session';
import { ReturnUserDto } from 'src/users/dto/returnUserDto';
import * as crypto from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(
    nickname: string,
    pass: string,
    session: SessionData,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.getAuthData(nickname);

    const hashedPassword = crypto.SHA256(pass).toString(crypto.enc.Hex);

    if (!user || user.password !== hashedPassword) {
      throw new UnauthorizedException('Ungültige Anmeldeinformationen');
    }

    session.user = session.user || {};
    session.isLoggedIn = true;
    session.user.nickname = user.nickname;

    return await this.usersService.getOne(nickname);
  }

  signOut(session: SessionData): void {
    session.isLoggedIn = undefined;
    session.user = undefined;
  }
}
