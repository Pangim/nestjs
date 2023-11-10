import { HttpException, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory(errors) {
        console.log(JSON.stringify(errors[0]));

        return new HttpException(
          {
            id: `Out.of.control.error`,
            message: "오류가 발생하였습니다. 고객센터로 문의해주세요.",
          },
          415,
        );
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();

  await app.listen(3005);
}
bootstrap();
