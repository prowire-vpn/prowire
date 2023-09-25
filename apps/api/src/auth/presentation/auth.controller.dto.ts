import {IsString} from 'class-validator';

export class AuthTokenRequestBodyDto {
  @IsString()
  code!: string;

  @IsString()
  code_verifier!: string;
}

export interface AuthTokenResponseBodyDto {
  access_token: string;
  refresh_token?: string;
}
