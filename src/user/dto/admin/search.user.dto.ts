import { IsString } from "class-validator";

export class SearchUserQueryDto {
  @IsString()
  nickname: string;
}
