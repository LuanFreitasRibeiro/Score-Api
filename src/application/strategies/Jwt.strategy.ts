import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRET_KEY } from 'src/commons/envs';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const userId: string = payload.sub;
    await this.cacheManager.set('userId_cached', userId);
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
