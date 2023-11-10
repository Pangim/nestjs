import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class CreateUserInputDto extends PickType(User, [
  "email",
  "nickname",
  "gender",
  "password",
]) {}

export class CreateUserOutputDto {
  jwt: string;
}
