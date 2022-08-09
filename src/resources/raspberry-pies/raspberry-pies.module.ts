import { Module } from "@nestjs/common";
import { RaspberryPiesService } from "./raspberry-pies.service";
import { LoggerWinston } from "../../services/logging/logging.service";
import { RaspberryPiesController } from "./raspberry-pies.controller";

@Module({
    controllers: [RaspberryPiesController],
    providers: [RaspberryPiesService, LoggerWinston],
})
export class RaspberryPiesModule {}
