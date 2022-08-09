import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { RaspberryPiesModule } from "./resources/raspberry-pies/raspberry-pies.module";

@Module({
    imports: [RaspberryPiesModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
