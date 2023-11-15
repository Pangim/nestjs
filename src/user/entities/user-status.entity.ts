import { IsDate } from "class-validator";
import { CommonEntity } from "src/common/common.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserStatus extends CommonEntity {
  @Column()
  @IsDate()
  lastLoginDate: Date;

  @Column()
  @IsDate()
  signUpDate: Date;

  @OneToOne(() => User, (user) => user.userStatus)
  @JoinColumn()
  user: User;
}
