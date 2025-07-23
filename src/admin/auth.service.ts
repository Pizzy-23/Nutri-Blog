import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return { id: admin.id, username: admin.username, role: UserRole.NUTRI };
    }
    return null;
  }
  async login(username: string, password: string) {
    const userPayload = await this.validateUser(username, password);
    if (!userPayload) throw new Error('Credenciais inválidas');
    return {
      access_token: this.jwtService.sign(userPayload),
    };
  }
}
