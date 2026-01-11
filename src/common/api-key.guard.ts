import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const expected = this.config.get<string>('API_KEY') ?? '';
    const provided = (req.headers['x-api-key'] as string | undefined) ?? '';

    if (!expected) {
      throw new UnauthorizedException('API key is not configured');
    }
    if (provided !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
