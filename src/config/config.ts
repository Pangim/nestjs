import { CommonModule } from "src/common/common.module";
import { UserStatus } from "src/user/entities/user-status.entity";
import { User } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";

export const ENTITIES = [User, UserStatus];

export const MODULES = [UserModule, CommonModule];
