import { User } from "../tables/User";

export const users: User[] = [
    {
      id: '1a2b3c4d-1234-5678-9012-abcdefabcdef',
      nickname: 'PlayerOne',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', //password123
      score: 1200,
      isAdmin: false,
      img: null,
    },
    {
      id: '2b3c4d5e-2345-6789-0123-bcdefbcdefbc',
      nickname: 'PlayerTwo',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', //password123
      score: 1100,
      isAdmin: false,
      img: null,
    },
    {
      id: '3c4d5e6f-3456-7890-1234-cdefcdefcdef',
      nickname: 'AdminUser',
      password: '749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70', //adminpassword
      score: 1500,
      isAdmin: true,
      img: null,
    },
    {
      id: '4d5e6f7g-4567-8901-2345-defdefdefdef',
      nickname: 'PlayerThree',
      password: 'c6ba91b90d922e159893f46c387e5dc1b3dc5c101a5a4522f03b987177a24a91', //password456
      score: 1300,
      isAdmin: false,
      img: null,
    },
    {
      id: '5e6f7g8h-5678-9012-3456-efefefefefef',
      nickname: 'PlayerFour',
      password: '5efc2b017da4f7736d192a74dde5891369e0685d4d38f2a455b6fcdab282df9c', //password789
      score: 1050,
      isAdmin: false,
      img: null,
    },
    {
      id: '6f7g8h9i-6789-0123-4567-fefefefefefe',
      nickname: 'PlayerFive',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', //password123
      score: 1150,
      isAdmin: false,
      img: null,
    },
  ];
  