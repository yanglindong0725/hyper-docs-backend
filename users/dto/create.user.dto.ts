import { Role } from "../../types/users.type";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar_url?: string;
  role?: Role;
}


