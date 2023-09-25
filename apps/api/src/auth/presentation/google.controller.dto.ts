import {IsString} from 'class-validator';

export class StartGoogleFlowQueryDto {
  @IsString()
  state!: string;

  @IsString()
  code_challenge!: string;

  @IsString()
  redirect_uri!: string;
}
