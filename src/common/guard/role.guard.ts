import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionRole } from "src/common/enum/common.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles || requireRoles.length === 0) {
      return true;
    }

    const { role } = context.switchToHttp().getRequest();

    return requireRoles.some((permissionRole) => role.includes(permissionRole));
  }
}
