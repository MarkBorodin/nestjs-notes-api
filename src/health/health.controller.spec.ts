import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns ok status with uptime and timestamp', () => {
    const res = controller.health();
    expect(res.status).toBe('ok');
    expect(typeof res.uptimeSec).toBe('number');
    expect(Number.isNaN(Date.parse(res.timestamp))).toBe(false);
  });

  it('returns versions from environment variables', () => {
    const prevAppVersion = process.env.APP_VERSION;
    const prevPackageVersion = process.env.npm_package_version;

    process.env.APP_VERSION = '2.0.0';
    process.env.npm_package_version = '1.0.0';

    const res = controller.version();
    expect(res.appVersion).toBe('2.0.0');
    expect(res.packageVersion).toBe('1.0.0');

    process.env.APP_VERSION = prevAppVersion;
    process.env.npm_package_version = prevPackageVersion;
  });
});
