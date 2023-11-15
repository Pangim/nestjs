import { IsEmail, IsEnum, IsString, Matches } from "class-validator";
import { CommonEntity } from "src/common/common.entity";
import { PermissionRole } from "src/common/enum/common.enum";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
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

  @Column({ enum: PermissionRole, default: PermissionRole.USER })
  @IsEnum(PermissionRole)
  role: PermissionRole;

  @Column()
  @IsString()
  @Matches(
    /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/,
  )
  password: string;

  @OneToOne(() => UserStatus, (UserStatus) => UserStatus.user)
  userStatus: UserStatus;
}
