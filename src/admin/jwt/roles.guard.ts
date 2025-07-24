// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(User)
    private adminRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user: userFromJwt } = context.switchToHttp().getRequest();
    if (!userFromJwt || !userFromJwt.id) {
      return false;
    }

    const adminFromDb = await this.adminRepository.findOneBy({
      id: userFromJwt.id,
    });

    if (!adminFromDb || !adminFromDb.role) {
      return false;
    }

    return requiredRoles.some((role) => adminFromDb.role === role);
  }
}