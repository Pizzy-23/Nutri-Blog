import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.username = :username', { username })
      .addSelect('admin.password')
      .getOne();
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return { id: admin.id, username: admin.username, role: UserRole.NUTRI };
    }
    return null;
  }

  async login(username: string, password: string) {
    const userPayload = await this.validateUser(username, password);

    if (!userPayload) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return {
      access_token: this.jwtService.sign(userPayload),
    };
  }
  async createFromUser(adminData: {
    username: string;
    password: string;
  }): Promise<Admin> {
    const { username, password } = adminData;

    const existingAdmin = await this.adminRepository.findOne({
      where: { username },
    });
    if (existingAdmin) {
      console.warn(
        `Tentativa de criar um admin duplicado para o username: ${username}`,
      );
      return existingAdmin;
    }

    const newAdmin = this.adminRepository.create({ username, password });
    return this.adminRepository.save(newAdmin);
  }
}
