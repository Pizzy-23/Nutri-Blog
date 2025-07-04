// src/admin/jwt/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET NA ESTRATÉGIA:', secret); // <-- DEBUG 1: O segredo foi carregado?

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        console.log('VALIDATE CHAMADO COM O PAYLOAD:', payload); // <-- DEBUG 2: O token é válido e o validate foi chamado?
        return { id: payload.id, username: payload.username };
    }
}