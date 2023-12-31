import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ENTITIES, MODULES } from "./config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
      envFilePath: process.env.IS_DEVELOP === "develop" ? ".env" : ".env",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.NEST_DB_HOST,
      port: +process.env.NEST_DB_PORT,
      username: process.env.NEST_DB_USERNAME,
      password: process.env.NEST_DB_PASSWORD,
      database: process.env.NEST_DB_NAME,
      synchronize: false,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
      entities: ENTITIES,
      charset: "utf8mb4",
    }),
    {
      ...JwtModule.register({
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      }),
      global: true,
    },
    ...MODULES,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
