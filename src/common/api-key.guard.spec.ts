import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './api-key.guard';

type HttpRequest = {
  headers: Record<string, string | undefined>;
};

function makeContext(headers: HttpRequest['headers']): ExecutionContext {
  const req: HttpRequest = { headers };
  const dummyClass = class DummyClass {};
  const handler = () => undefined;
  return {
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => undefined,
      getNext: () => undefined,
    }),
    getClass: () => dummyClass,
    getHandler: () => handler,
    getType: () => 'http',
    getArgs: () => [],
    getArgByIndex: () => undefined,
    switchToRpc: () => ({
      getContext: () => undefined,
      getData: () => undefined,
    }),
    switchToWs: () => ({
      getClient: () => undefined,
      getData: () => undefined,
      getPattern: () => undefined,
    }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  it('rejects when API key is not configured', () => {
    const config = {
      get: jest.fn().mockReturnValue(''),
    } as unknown as ConfigService;
    const guard = new ApiKeyGuard(config);

    expect(() => guard.canActivate(makeContext({}))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when API key does not match', () => {
    const config = {
      get: jest.fn().mockReturnValue('expected'),
    } as unknown as ConfigService;
    const guard = new ApiKeyGuard(config);

    expect(() =>
      guard.canActivate(makeContext({ 'x-api-key': 'wrong' })),
    ).toThrow(UnauthorizedException);
  });

  it('allows when API key matches', () => {
    const config = {
      get: jest.fn().mockReturnValue('expected'),
    } as unknown as ConfigService;
    const guard = new ApiKeyGuard(config);

    expect(guard.canActivate(makeContext({ 'x-api-key': 'expected' }))).toBe(
      true,
    );
  });
});
