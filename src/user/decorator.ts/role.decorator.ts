import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { PermissionRole } from "src/common/enum/common.enum";
import { JwtAuthGuard } from "src/common/guard/jwt.guard";
import { RolesGuard } from "src/common/guard/role.guard";

export function RoleGuard(...roles: PermissionRole[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    Roles(roles),
  );
}

export const Roles = (roles: PermissionRole[]) => SetMetadata("roles", roles);
