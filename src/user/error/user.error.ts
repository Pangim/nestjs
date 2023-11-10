import { CommonError } from "src/common/error/core.error";

export const USER_ERROR = {
  USER_NOT_FOUND: "userNotFound",
  DUPLICATED_EMAIL: "duplicatedEamil",
  DUPLICATED_NICKNAME: "duplicatedNickname",
};

export class UserError extends CommonError {
  constructor() {
    super();
    this.errorHandle = {
      [USER_ERROR.USER_NOT_FOUND]: {
        id: "User.not.found",
        message: "유저를 찾을 수 없습니다",
      },
      [USER_ERROR.DUPLICATED_EMAIL]: {
        id: "User.duplicated.email",
        message: "이미 가입된 메일입니다.",
      },
      [USER_ERROR.DUPLICATED_NICKNAME]: {
        id: "User.duplicated.nickname",
        message: "이미 존재하는 닉네임입니다.",
      },
    };
  }
}
