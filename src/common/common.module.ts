import { Global, Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { CommonError } from "./error/common.error";

@Global()
@Module({
  imports: [],
  exports: [CommonService, CommonError],
  providers: [CommonService, CommonError],
  controllers: [],
})
export class CommonModule {}
