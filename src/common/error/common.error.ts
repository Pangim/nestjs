import { CoreError } from "src/common/error/core.error";

export const COMMON_ERROR = {
  ACCESS_TOKEN_ERROR: "accessTokenError",
  ACCESS_TOKEN_EXPIRED: "accessTokenExpired",
  USER_NOT_FOUND: "userNotFound",
};

export class CommonError extends CoreError {
  constructor() {
    super();
    this.errorHandle = {
      [COMMON_ERROR.ACCESS_TOKEN_ERROR]: {
        id: "Access.token.error",
        message: "엑세스 토큰 정볼르 찾을 수 없습니다",
      },
      [COMMON_ERROR.ACCESS_TOKEN_EXPIRED]: {
        id: "Access.token.expired",
        message: "엑세스 토큰이 만료되었습니다",
      },
      [COMMON_ERROR.USER_NOT_FOUND]: {
        id: "user.not.found",
        message: "유저를 찾을 수 없습니다.",
      },
    };
  }
}
