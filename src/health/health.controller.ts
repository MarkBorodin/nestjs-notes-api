import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  private readonly startedAt = Date.now();

  @Get('/health')
  health() {
    const uptimeSec = Math.floor((Date.now() - this.startedAt) / 1000);
    return {
      status: 'ok',
      uptimeSec,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/version')
  version() {
    return {
      appVersion: process.env.APP_VERSION ?? 'unknown',
      packageVersion: process.env.npm_package_version ?? 'unknown',
    };
  }
}
