import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { PermissionRole } from "src/common/enum/common.enum";
import { RoleGuard } from "src/user/decorator.ts/role.decorator";
import { SearchUserQueryDto } from "src/user/dto/admin/search.user.dto";
import { Admin_UserService } from "src/user/service/admin/user.service";
import { TransformInterceptor } from "util/transform.interceptor";

@RoleGuard(PermissionRole.ADMIN)
@Controller({ version: "1", path: "admin/users" })
@UseInterceptors(TransformInterceptor)
export class Admin_UserController {
  constructor(private readonly userService: Admin_UserService) {}

  @Get("search")
  async getMyInfo(@Query() query: SearchUserQueryDto) {
    return await this.userService.searchUser(query);
  }
}
