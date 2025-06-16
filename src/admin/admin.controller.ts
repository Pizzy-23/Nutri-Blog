import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthService } from './auth.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() body: { username: string, password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
