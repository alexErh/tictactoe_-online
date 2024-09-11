import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
  Session,
  Header,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './change-password.dto';

@ApiTags('Profil')
@Controller('profil')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('stats')
  async getPlayerStats(@Session() session: Record<string, any>) {
    const nickname = session.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.profileService.getPlayerStats(nickname);
  }

  @Get('history')
  async getGameHistory(@Session() session: Record<string, any>) {
    const nickname = session.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.profileService.getGameHistory(nickname);
  }

  @Get('statistics')
  async getGameStatistics(
    @Session() session: Record<string, any>,
  ): Promise<{ wins: number; losses: number }> {
    const nickname = session.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.profileService.getGameStatistics(nickname);
  }

  @Post('change-password')
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Session() session: Record<string, any>,
  ) {
    const nickname = session.user?.nickname;
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
      return { message };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Ändern des Passworts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async saveProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, any>,
  ) {
    const nickname = session.user?.nickname;
    if (!nickname) {
      throw new HttpException(
        'Benutzer nicht angemeldet',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      if (!file) {
        throw new HttpException(
          'Kein Bild hochgeladen',
          HttpStatus.BAD_REQUEST,
        );
      }

      const message = await this.profileService.saveProfileImage(
        nickname,
        file,
      );
      return { message };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Hochladen des Bildes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile-image')
  @Header('Content-Type', 'image/png')
  async getProfileImage(@Query('nickname') nickname: string) {
    try {
      const imageBuffer = await this.profileService.getProfileImage(nickname);
      return imageBuffer;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen des Bildes',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
