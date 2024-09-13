
export interface UserDto {  
    isLoggedIn: boolean;
    user: {
        id: string;

        nickname: string;

        score: number;

        img: string;

        isAdmin: boolean;
    }
  }