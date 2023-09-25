import {IsOptional, IsString} from 'class-validator';

export class RefreshTokenRequestBodyDto {
  @IsOptional()
  @IsString()
  refresh_token?: string;
}

export interface RefreshTokenResponseBodyDto {
  access_token: string;
  refresh_token?: string;
}
