import { Injectable, NestMiddleware } from "@nestjs/common";
import { LoggerWinston } from "../../services/logging/logging.service";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {

  constructor(private logger: LoggerWinston) {}

  async use(req: Request, res: Response, next: NextFunction) {
    (await this.logger.getMiddleware())(req, res, next);
  }

}
