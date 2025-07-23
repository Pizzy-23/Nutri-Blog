import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return { id: admin.id, username: admin.username };
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new Error('Credenciais inválidas');
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
