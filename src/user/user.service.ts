import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';
import { AuthService } from 'src/admin/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly adminService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Um usuário com este e-mail já existe.');
    }
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashed;
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    if (savedUser.role === UserRole.NUTRI) {
      console.log(
        `Usuário ${savedUser.email} é um nutri. Sincronizando com a tabela Admin...`,
      );
      try {
        await this.adminService.createFromUser({
          username: savedUser.email,
          password: createUserDto.password,
        });
        console.log(
          `Admin criado com sucesso para o usuário ${savedUser.email}`,
        );
      } catch (error) {
        console.error(
          `Falha ao sincronizar o nutri ${savedUser.email} com a tabela Admin:`,
          error,
        );
      }
    }

    delete savedUser.password;
    return savedUser;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
