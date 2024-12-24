import { IsNotEmpty, Matches, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'El password es obligatorio' })
  @Min(8, { message: 'El password debe de ser minimo de 8 caracteres' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/, {
    message:
      'La contraseña debe incluir al menos un carácter especial y un número',
  })
  password: string;

  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio' })
  name: string;
}
