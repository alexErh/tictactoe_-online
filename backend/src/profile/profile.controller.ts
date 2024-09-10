import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './change-password.dto';

@ApiTags('Profil')
@Controller('profil')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('stats')
  @UseGuards(AuthGuard)
  async getPlayerStats(@Req() req: Request) {
    const nickname = req.session?.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.profileService.getPlayerStats(nickname);
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async getGameHistory(@Req() req: Request) {
    const nickname = req.session?.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.profileService.getGameHistory(nickname);
  }

  @Get('statistics')
  @UseGuards(AuthGuard)
  async getGameStatistics(
    @Req() req: Request,
  ): Promise<{ wins: number; losses: number }> {
    const nickname = req.session?.user?.nickname;
    return this.profileService.getGameStatistics(nickname);
  }

  @Post('change-password')
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const nickname = req.session?.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const message = await this.profileService.changePassword(
        nickname,
        changePasswordDto.password,
      );
      return res.status(HttpStatus.OK).send(message);
    } catch (error) {
      throw new HttpException(
        'Fehler beim Ändern des Passworts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async saveProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const nickname = req.session?.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      if (!file) {
        throw new Error('Kein Bild hochgeladen');
      }

      const message = await this.profileService.saveProfileImage(
        nickname,
        file,
      );
      return res.status(200).send(message);
    } catch (error) {
      res.status(500).send('Fehler beim Hochladen des Bildes');
    }
  }

  @Get('profile-image')
  @UseGuards(AuthGuard)
  async getProfileImage(
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const imageBuffer = await this.profileService.getProfileImage(nickname);

      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="${nickname}-profile.png"`,
      });

      return res.send(imageBuffer);
    } catch (error) {
      res.status(404).send('Fehler beim Abrufen des Bildes');
    }
  }
}
