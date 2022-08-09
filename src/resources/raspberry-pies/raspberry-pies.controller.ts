import { RaspberryPiesService, SERVICE_CODE } from "./raspberry-pies.service";
import { Controller, Post, UseFilters, UseInterceptors, Version } from "@nestjs/common";
import { AddDataTransformInterceptor } from "../../interceptors/transform/addData.transform.interceptor";
import { HttpExceptionFilter } from "../../filters/http-exception/http-exception.filter";
import { HttpException } from "../../exceptions/http/http.exceptions";

@UseInterceptors(AddDataTransformInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller("raspberry-pies")
export class RaspberryPiesController {
    constructor(private readonly service: RaspberryPiesService) {}

    @Version("1")
    @Post()
    async create() {
        const { code, data } = await this.service.create();
        switch (code) {
            case SERVICE_CODE.OK:
                return data;
            case SERVICE_CODE.KO:
                throw new HttpException({ message: `Impossibile creare il dispositivo` }, 500);
        }
    }
}
