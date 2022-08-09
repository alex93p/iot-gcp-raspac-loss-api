import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import { LoggerWinston } from "./services/logging/logging.service";
import env from "./env/env";
import helmet from "helmet";
import { json, urlencoded } from "express";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new LoggerWinston(),
    });
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": ["'self'"],
                },
            },
        })
    );
    app.use(json({ limit: "1mb" }));
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.enableCors();
    app.setGlobalPrefix("api", { exclude: ["healtz"] });
    app.enableVersioning({ type: VersioningType.URI });

    await app.listen(env.SERVER.PORT);
}
bootstrap();
