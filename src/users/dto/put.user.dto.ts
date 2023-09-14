export interface PutUserDto {
  name: string;
  email: string;
  password: string;
  avatar_url: string;
  permissionFlags: number;
}
