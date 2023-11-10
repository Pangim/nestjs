import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserStatus } from "./entities/user-status.entity";
import { User } from "./entities/user.entity";
import { UserError } from "./error/user.error";
import { User_UserController } from "./user/user.controller";
import { User_UserService } from "./user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStatus])],
  controllers: [User_UserController],
  providers: [User_UserService, UserError],
})
export class UserModule {}
