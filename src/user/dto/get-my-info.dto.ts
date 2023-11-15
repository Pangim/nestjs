import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class GetMyInfoOutputDto extends PickType(User, ["id", "email"]) {
  lastLoginDate: Date;
}
