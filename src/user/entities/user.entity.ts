import { IsEmail, IsEnum, IsString, Matches } from "class-validator";
import { CommonEntity } from "src/common/common.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { GenderType } from "../enum/user.enum";
import { UserStatus } from "./user-status.entity";

@Entity()
export class User extends CommonEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  nickname: string;

  @Column({ enum: GenderType })
  @IsEnum(GenderType)
  gender: GenderType;

  @Column()
  @IsString()
  @Matches(
    /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/,
  )
  password: string;

  @OneToMany(() => UserStatus, (UserStatus) => UserStatus.user)
  @JoinColumn()
  UserStatus: UserStatus;
}
