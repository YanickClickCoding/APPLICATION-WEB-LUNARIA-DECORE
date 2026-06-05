import { IsString, Matches, Length } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Numéro invalide' })
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Numéro invalide' })
  phone: string;

  @IsString() @Length(6, 6) code: string;
}
