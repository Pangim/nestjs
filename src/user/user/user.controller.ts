import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { TransformInterceptor } from "util/transform.interceptor";
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from "../dto/create-user.dto";
import { User_UserService } from "./user.service";

@Controller({ version: "1", path: "users" })
@UseInterceptors(TransformInterceptor)
export class User_UserController {
  constructor(private readonly userService: User_UserService) {}

  @Post()
  async createUser(
    @Body() body: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    await this.userService.createUserRoleCheck(body);

    return await this.userService.createUser(body);
  }
}
