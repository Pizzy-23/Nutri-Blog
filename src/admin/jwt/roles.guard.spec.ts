import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../user/enums/user-role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockExecutionContext = (user, requiredRoles?: UserRole[]) => {
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    return mockContext as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    const context = mockExecutionContext({ role: UserRole.DEFAULT }, undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    const context = mockExecutionContext({ role: UserRole.NUTRI }, [
      UserRole.NUTRI,
    ]);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    const context = mockExecutionContext({ role: UserRole.DEFAULT }, [
      UserRole.NUTRI,
    ]);
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access if user has no role property', () => {
    const context = mockExecutionContext({ name: 'test-user' }, [
      UserRole.NUTRI,
    ]);
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should handle multiple required roles correctly', () => {
    const allowedContext = mockExecutionContext({ role: UserRole.DEFAULT }, [
      UserRole.NUTRI,
      UserRole.DEFAULT,
    ]);
    expect(guard.canActivate(allowedContext)).toBe(true);

    const deniedContext = mockExecutionContext({ role: 'other_role' }, [
      UserRole.NUTRI,
      UserRole.DEFAULT,
    ]);
    expect(guard.canActivate(deniedContext)).toBe(false);
  });
});
