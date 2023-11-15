import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class CommonService {
  constructor(private readonly jwtService: JwtService) {}

  async hash(txt: string): Promise<string> {
    const saltOrRounds = 10;

    return await bcrypt.hash(txt, saltOrRounds);
  }

  createAccessToken(payload: object): string {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE,
    });

    return accessToken;
  }
}
