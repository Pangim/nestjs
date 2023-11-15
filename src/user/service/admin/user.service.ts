import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "src/common/common.service";
import { PermissionRole } from "src/common/enum/common.enum";
import { SearchUserQueryDto } from "src/user/dto/admin/search.user.dto";
import { GetMyInfoOutputDto } from "src/user/dto/get-my-info.dto";
import { Connection, Like, Repository } from "typeorm";
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from "../../dto/public/create-user.dto";
import { UserStatus } from "../../entities/user-status.entity";
import { User } from "../../entities/user.entity";
import { UserError, USER_ERROR } from "../../error/user.error";

@Injectable()
export class Admin_UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,

    private readonly commonService: CommonService,
    private readonly userError: UserError,

    private readonly connection: Connection,
  ) {}

  async searchUser(query: SearchUserQueryDto) {
    const { nickname } = query;
    try {
      const likeNickname = `%${nickname}%`;

      //repository
      const repoUser = await this.userRepository.findOne({
        select: {
          id: true,
          nickname: true,
          userStatus: { id: true, lastLoginDate: true },
        },
        where: { nickname: Like(likeNickname), role: PermissionRole.USER },
        relations: { userStatus: true },
      });

      //queryBuilderUser
      const queryBuilderUser = await this.userRepository
        .createQueryBuilder("u")
        .leftJoin("u.userStatus", "us")
        .select(["u.id", "u.nickname", "us.id", "us.lastLoginDate"])
        .where("u.nickname LIKE :nickname", { nickname: likeNickname })
        .andWhere("u.role = :role", { role: PermissionRole.USER })
        .getOne();

      //queryBuilderRawUser
      const queryBuilderRawUser = await this.userRepository
        .createQueryBuilder("u")
        .leftJoin("u.userStatus", "us")
        .select(["u.id", "u.nickname", "us.id", "us.lastLoginDate"])
        .where("u.nickname LIKE :nickname", { nickname: likeNickname })
        .andWhere("u.role = :role", { role: PermissionRole.USER })
        .getRawOne();

      console.log(repoUser, queryBuilderUser, queryBuilderRawUser);

      if (!repoUser || !queryBuilderUser || !queryBuilderRawUser) {
        throw new NotFoundException(USER_ERROR.USER_NOT_FOUND);
      }

      const result = {
        repoUser: {
          id: repoUser.id,
          nickname: repoUser.nickname,
          lastLoginDate: repoUser.userStatus.lastLoginDate,
        },
        queryBuilderUser: {
          id: queryBuilderUser.id,
          nickname: queryBuilderUser.nickname,
          lastLoginDate: queryBuilderUser.userStatus.lastLoginDate,
        },
        queryBuilderRawUser: {
          id: queryBuilderRawUser.u_id,
          nickname: queryBuilderRawUser.u_nickname,
          lastLoginDate: queryBuilderRawUser.us_last_login_date,
        },
      };

      return result;
    } catch (error) {
      const statusCode = error.response
        ? error.response.statusCode
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(this.userError.errorHandler(error), statusCode);
    }
  }
}
