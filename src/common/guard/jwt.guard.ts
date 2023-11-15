import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "src/common/common.service";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { PermissionRole } from "../enum/common.enum";
import { CommonError, COMMON_ERROR } from "../error/common.error";
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly commonError: CommonError,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      if (authorization) {
        const access_token = authorization?.split(" ")[1];

        const accessTokenErrorCheck = this.accessTokenErrorCheck(access_token);
        if (!accessTokenErrorCheck) {
          throw new ForbiddenException(COMMON_ERROR.ACCESS_TOKEN_ERROR);
        }

        const decodeAccessToken = this.jwtService.decode(access_token);

        const jwtExpireCheck = this.accessTokenExpireCheck(access_token);

        //토큰 유효성 체크
        if (!decodeAccessToken) {
          throw new ForbiddenException(COMMON_ERROR.ACCESS_TOKEN_ERROR);
        }

        //토큰 만료 체크
        if (!jwtExpireCheck) {
          throw new ForbiddenException(COMMON_ERROR.ACCESS_TOKEN_EXPIRED);
        }

        const userId = await this.validateToken(access_token);
        const user = await this.validateUserAuthGuard(userId);

        request["userId"] = user.userId;
        request["role"] = user.role;
      } else {
        request["role"] = PermissionRole.PUBLIC;
      }

      return true;
    } catch (error) {
      const statusCode = error.response
        ? error.response.statusCode
        : HttpStatus.BAD_REQUEST;

      throw new HttpException(this.commonError.errorHandler(error), statusCode);
    }
  }

  async validateToken(token: string) {
    const verify = this.jwtService.verify(token).id;

    return verify;
  }

  private accessTokenExpireCheck(jwt: string) {
    try {
      this.jwtService.verify(jwt, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      return true;
    } catch (error) {
      if (error.message === "jwt expired") {
        return false;
      }
    }
  }

  private accessTokenErrorCheck(jwt: string) {
    try {
      this.jwtService.verify(jwt, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      return true;
    } catch (error) {
      if (error.message === "jwt expired") {
        return true;
      } else {
        false;
      }
    }
  }

  private async validateUserAuthGuard(userId: number) {
    const user = await this.userRepository.findOne({
      select: { id: true, role: true },
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(COMMON_ERROR.USER_NOT_FOUND);
    }

    return {
      userId: user.id,
      role: user.role,
    };
  }
}
