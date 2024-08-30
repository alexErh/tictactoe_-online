import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import { SessionData } from 'express-session';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signIn(nickname: string, pass: string, session: SessionData): Promise<void> {
        const user = await this.usersService.getOne(nickname);
        console.log("user", user);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        session.isLoggedIn = true;
        session.user = { nickname: user.nickname };
    }

    signOut(session: SessionData): void {
        session.isLoggedIn = undefined;
        delete session.user;
    }

}
