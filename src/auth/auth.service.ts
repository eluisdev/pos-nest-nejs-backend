import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new NotFoundException('Contraseña incorrecta');
    }

    const payload = { userId: user.id, username: user.name, rol: user.rol };
    const { rol } = user;
    return {
      token: await this.jwtService.signAsync(payload),
      rol,
    };
  }

  async register(register: registerDto) {
    const user = await this.usersService.create(register);
    const payload = { userId: user.id, username: user.name, rol: user.rol };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
