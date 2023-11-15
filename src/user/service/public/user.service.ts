import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "src/common/common.service";
import { Connection, Repository } from "typeorm";
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from "../../dto/public/create-user.dto";
import { UserStatus } from "../../entities/user-status.entity";
import { User } from "../../entities/user.entity";
import { UserError, USER_ERROR } from "../../error/user.error";

@Injectable()
export class Public_UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,

    private readonly commonService: CommonService,
    private readonly userError: UserError,

    private readonly connection: Connection,
  ) {}

  async createUserRoleCheck(body: CreateUserInputDto): Promise<string> {
    const { email, nickname } = body;

    try {
      const checkDuplicateEmail = await this.userRepository.findOne({
        select: { id: true },
        where: { email },
      });

      if (checkDuplicateEmail) {
        throw new ConflictException(USER_ERROR.DUPLICATED_EMAIL);
      }

      const checkDuplicateNickname = await this.userRepository.findOne({
        select: { id: true },
        where: { nickname },
      });

      if (checkDuplicateNickname) {
        throw new ConflictException(USER_ERROR.DUPLICATED_NICKNAME);
      }

      return "done";
    } catch (error) {
      const statusCode = error.response
        ? error.response.statusCode
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(this.userError.errorHandler(error), statusCode);
    }
  }

  async createUser(body: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const { email, nickname, password, gender } = body;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashPassword = await this.commonService.hash(password);

      //유저 생성
      const user = await queryRunner.manager.save(User, {
        email,
        nickname,
        gender,
        password: hashPassword,
      });

      //유저 상태 생성
      const now = new Date();
      await queryRunner.manager.insert(UserStatus, {
        lastLoginDate: now,
        signUpDate: now,
        user: { id: user.id },
      });

      //accessToken 생성
      const payload = { id: user.id };
      const accessToken = this.commonService.createAccessToken(payload);

      await queryRunner.commitTransaction();

      return { jwt: accessToken };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const statusCode = error.response
        ? error.response.statusCode
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(this.userError.errorHandler(error), statusCode);
    } finally {
      await queryRunner.release();
    }
  }
}
