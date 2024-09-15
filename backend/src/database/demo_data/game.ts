import { GameEntity } from "../tables/GameEntity";
import { users } from "./user";

export const games: GameEntity[] = [
    {
      id: 'a1b2c3d4-1111-2222-3333-abcdefabcdef',
      player1: users[0],  // PlayerOne
      player2: users[1],  // PlayerTwo
      winner: 'PlayerOne',
    },
    {
      id: 'b2c3d4e5-4444-5555-6666-bcdefbcdefbc',
      player1: users[1],  // PlayerTwo
      player2: users[2],  // AdminUser
      winner: 'AdminUser',
    },
    {
      id: 'c3d4e5f6-7777-8888-9999-cdefcdefcdef',
      player1: users[0],  // PlayerOne
      player2: users[2],  // AdminUser
      winner: null,  // Game in progress
    },
    {
      id: 'd4e5f6g7-1234-2345-3456-defdefdefdef',
      player1: users[3],  // PlayerThree
      player2: users[4],  // PlayerFour
      winner: 'PlayerThree',
    },
    {
      id: 'e5f6g7h8-4567-5678-6789-efefefefefef',
      player1: users[4],  // PlayerFour
      player2: users[5],  // PlayerFive
      winner: 'Draw',
    },
    {
      id: 'f6g7h8i9-7890-8901-9012-fefefefefefe',
      player1: users[2],  // AdminUser
      player2: users[3],  // PlayerThree
      winner: 'AdminUser',
    },
    {
      id: 'g7h8i9j0-9012-1234-3456-abcdefabcdef',
      player1: users[1],  // PlayerTwo
      player2: users[4],  // PlayerFour
      winner: null,  // Game in progress
    },
    {
      id: 'h8i9j0k1-1234-5678-9012-bcdefbcdefbc',
      player1: users[0],  // PlayerOne
      player2: users[5],  // PlayerFive
      winner: 'Draw',
    },
  ];
  