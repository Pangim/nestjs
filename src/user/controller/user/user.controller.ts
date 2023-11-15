import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { PermissionRole } from "src/common/enum/common.enum";
import { GetUserId } from "src/user/decorator.ts/user.decorator";
import { GetMyInfoOutputDto } from "src/user/dto/get-my-info.dto";
import { TransformInterceptor } from "util/transform.interceptor";
import { RoleGuard } from "../../decorator.ts/role.decorator";
import { User_UserService } from "../../service/user/user.service";

@Controller({ version: "1", path: "users" })
@RoleGuard(PermissionRole.USER)
@UseInterceptors(TransformInterceptor)
export class User_UserController {
  constructor(private readonly userService: User_UserService) {}

  @Get("info")
  async getMyInfo(@GetUserId() userId: number): Promise<GetMyInfoOutputDto> {
    return await this.userService.getMyInfo(userId);
  }
}
