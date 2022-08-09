import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { AddDataTransformInterceptor } from "./interceptors/transform/addData.transform.interceptor";

@UseInterceptors(AddDataTransformInterceptor)
@Controller()
export class AppController {
  @Get("healtz")
  hc() {
    return "Ok";
  }
}
