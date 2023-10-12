export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar_url?: string;
  permission?: number;
}
