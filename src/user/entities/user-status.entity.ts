import { IsDate } from "class-validator";
import { CommonEntity } from "src/common/common.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserStatus extends CommonEntity {
  @Column()
  @IsDate()
  lastLoginDate: Date;

  @Column()
  @IsDate()
  signUpDate: Date;

  @OneToMany(() => User, (user) => user.UserStatus)
  user: User;
}
