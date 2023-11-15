import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { PermissionRole } from "src/common/enum/common.enum";
import { GetUserId } from "src/user/decorator.ts/user.decorator";
import { Public_UserService } from "src/user/service/public/user.service";
import { TransformInterceptor } from "util/transform.interceptor";
import { RoleGuard } from "../../decorator.ts/role.decorator";
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from "../../dto/public/create-user.dto";

@Controller({ version: "1", path: "users" })
@RoleGuard(PermissionRole.PUBLIC)
@UseInterceptors(TransformInterceptor)
export class Public_UserController {
  constructor(private readonly userService: Public_UserService) {}

  @Post()
  async createUser(
    @Body() body: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    await this.userService.createUserRoleCheck(body);

    return await this.userService.createUser(body);
  }
}
