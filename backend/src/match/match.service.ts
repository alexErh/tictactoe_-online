//Logik des Matchmaking: 1.finden von Gegner 2.warteschlange verwalten
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export interface Player {
  nickname: string;
  elo: number;
  clientId?: string;
}

@Injectable()
export class MatchService {
  private playersQueue: Player[] = [];

  constructor(private userService: UsersService) {}

  //Sucht in der Datenbank (über UsersService) nach dem Benutzer.
  async identify(user: string, clientId: string) {
    const existingUser = await this.userService.getOne(user);
    if (existingUser) {
      console.log(
        `User identified: ${existingUser.nickname} with client ID: ${clientId}`,
      );
    } else {
      console.log(`User not found: ${user}`);
    }
  }

  async findMatch(playerData: Player): Promise<Player | null> {
    const suitableOpponent = this.playersQueue.find(
      (player) => Math.abs(player.elo - playerData.elo) < 200,
    );
    //Wenn ein geeigneter Gegner gefunden wird, entfernt sie diesen aus der Warteschlange und gibt ihn zurück.
    if (suitableOpponent) {
      this.playersQueue = this.playersQueue.filter(
        (player) => player.clientId !== suitableOpponent.clientId,
      );
      return suitableOpponent;
    }

    this.playersQueue.push({ ...playerData, clientId: playerData.clientId });
    return null;
  }

  disconnect(clientId: string) {
    this.playersQueue = this.playersQueue.filter(
      (player) => player.clientId !== clientId,
    );
  }

  async getPlayerData(nickname: string): Promise<Player | null> {
    const user = await this.userService.getOne(nickname);
    if (user) {
      return {
        nickname: user.nickname,
        elo: user.score || 1000,
        clientId: null,
      };
    }
    return null;
  }

  cancelQueue(clientId: string) {
    this.playersQueue = this.playersQueue.filter(
      (player) => player.clientId !== clientId,
    );
  }
}
