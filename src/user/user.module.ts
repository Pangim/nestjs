import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserStatus } from "./entities/user-status.entity";
import { User } from "./entities/user.entity";
import { UserError } from "./error/user.error";
import { User_UserController } from "./controller/user/user.controller";
import { User_UserService } from "./service/user/user.service";
import { Public_UserController } from "./controller/public/user.controller";
import { Admin_UserController } from "./controller/admin/user.controller";
import { Public_UserService } from "./service/public/user.service";
import { Admin_UserService } from "./service/admin/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStatus])],
  controllers: [
    User_UserController,
    Public_UserController,
    Admin_UserController,
  ],
  providers: [
    User_UserService,
    Public_UserService,
    Admin_UserService,
    UserError,
  ],
})
export class UserModule {}
