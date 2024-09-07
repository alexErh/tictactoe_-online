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
import { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './change-password.dto';
import { SessionData } from 'express-session';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Profil')
@Controller('profil')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('stats')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'nickname', type: String, description: 'User nickname' })
  async getPlayerStats(@Query('nickname') nickname: string) {
    return await this.profileService.getPlayerStats(nickname);
  }

  @Get('history')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'nickname', type: String, description: 'User nickname' })
  async getGameHistory(@Query('nickname') nickname: string) {
    return await this.profileService.getGameHistory(nickname);
  }

  @Post('change-password')
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    try {
      const message = await this.profileService.changePassword(
        changePasswordDto.nickname,
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { session: SessionData },
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        throw new Error('Kein Bild hochgeladen');
      }

      const currentUser = req.session?.user;
      if (!currentUser) {
        throw new Error('Nicht autorisiert');
      }

      const message = await this.profileService.saveProfileImage(
        currentUser.nickname,
        file,
      );
      return res.status(200).send(message);
    } catch (error) {
      res.status(500).send('Fehler beim Hochladen des Bildes');
    }
  }

  @Get('profile-image')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'nickname', type: String, description: 'User nickname' })
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
