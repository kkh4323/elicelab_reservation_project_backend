import { Role } from '@user/entities/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { User } from '@user/entities/user.entity';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const req: RequestWithUserInterface = context
        .switchToHttp()
        .getRequest<RequestWithUserInterface>();
      const user: User = req.user;
      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
