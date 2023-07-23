import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetContacts {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class CreateContactDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
