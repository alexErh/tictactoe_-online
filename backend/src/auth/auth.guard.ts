import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { SessionData } from "express-session";
import { Request } from 'express';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "./public.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const session: SessionData = request.session;
    return session.isLoggedIn == true;
  }

}