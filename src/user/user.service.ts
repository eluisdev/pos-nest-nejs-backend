import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const userExist = await this.userRepository.findOne({ where: { email } });
    const errors = [];
    if (userExist) {
      errors.push('Usuario ya registrado');
      throw new ConflictException(errors);
    }
    const user = new User();
    user.email = email;

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.name = name;

    return this.userRepository.save(user);
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No existe un usuario con ese email');
    }
    return user;
  }

  async findById(id: number) {
    const [user] = await this.userRepository.find({
      where: { id },
      select: ['id', 'email', 'name', 'rol'],
    });
    return user;
  }
}
