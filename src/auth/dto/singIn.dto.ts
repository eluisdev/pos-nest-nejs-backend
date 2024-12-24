import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class signInDto {
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'El password es obligatorio' })
  @MinLength(8, { message: 'El password debe de ser minimo de 8 caracteres' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/, {
    message:
      'La contraseña debe incluir al menos un carácter especial y un número',
  })
  password: string;
}
