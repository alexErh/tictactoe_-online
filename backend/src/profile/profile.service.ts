import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/tables/User';
import { Game } from '../database/tables/Game';
import { Buffer } from 'buffer';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getPlayerStats(nickname: string) {
    try {
      const stats = await this.userRepository.findOne({
        where: { nickname: nickname },
      });
      if (!stats) {
        throw new HttpException('Nutzer nicht gefunden', HttpStatus.NOT_FOUND);
      }
      return stats;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen der Spielerstatistiken',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGameHistory(nickname: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });
      if (!user) {
        throw new HttpException('Nutzer nicht gefunden', HttpStatus.NOT_FOUND);
      }

      const history = await this.gameRepository.find({
        where: [{ player1: user }, { player2: user }],
      });
      return history;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen der Spielhistorie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGameStatistics(nickname: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });
      if (!user) {
        throw new HttpException('Nutzer nicht gefunden', HttpStatus.NOT_FOUND);
      }

      const games = await this.gameRepository.find({
        where: [{ player1: user }, { player2: user }],
      });

      const wins = games.filter((game) => game.winner === user.nickname).length;
      const losses = games.filter(
        (game) => game.winner && game.winner !== user.nickname,
      ).length;

      return { wins, losses };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen der Spielstatistik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(nickname: string, newPassword: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });

      if (user) {
        user.password = newPassword;
        await this.userRepository.save(user);
        return 'Passwort erfolgreich geändert';
      } else {
        throw new HttpException(
          'Benutzer nicht gefunden',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Fehler beim Ändern des Passworts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveProfileImage(
    nickname: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });

      if (!user) {
        throw new HttpException(
          'Benutzer nicht gefunden',
          HttpStatus.NOT_FOUND,
        );
      }
      if (file.buffer instanceof Buffer) {
        user.img = file.buffer;
      }
      await this.userRepository.save(user);
      return 'Bild erfolgreich gespeichert';
    } catch (error) {
      throw new HttpException(
        'Fehler beim Speichern des Bildes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileImage(nickname: string): Promise<Buffer> {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });
      if (!user || !user.img) {
        throw new HttpException('Bild nicht gefunden', HttpStatus.NOT_FOUND);
      }
      return user.img;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen des Bildes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
