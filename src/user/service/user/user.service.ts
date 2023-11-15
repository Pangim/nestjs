import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "src/common/common.service";
import { GetMyInfoOutputDto } from "src/user/dto/get-my-info.dto";
import { Connection, Repository } from "typeorm";
import { UserStatus } from "../../entities/user-status.entity";
import { User } from "../../entities/user.entity";
import { UserError, USER_ERROR } from "../../error/user.error";

@Injectable()
export class User_UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,

    private readonly commonService: CommonService,
    private readonly userError: UserError,

    private readonly connection: Connection,
  ) {}

  async getMyInfo(userId: number): Promise<GetMyInfoOutputDto> {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
          email: true,
          userStatus: { id: true, lastLoginDate: true },
        },
        where: { id: userId },
        relations: { userStatus: true },
      });

      if (!user) {
        throw new NotFoundException(USER_ERROR.USER_NOT_FOUND);
      }

      const result = {
        id: user.id,
        email: user.email,
        lastLoginDate: user.userStatus.lastLoginDate,
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
