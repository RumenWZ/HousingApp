export interface User {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

export interface UserForLogin {
  username: string;
  password: string;
  token: string;
}
