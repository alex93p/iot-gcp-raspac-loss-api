import env from "../../env/env";
import { createLogger, transports, Logger as L, format } from "winston";
import { express, LoggingWinston } from "@google-cloud/logging-winston";
import { Injectable, LoggerService } from "@nestjs/common";
import { ConsoleTransportInstance } from "winston/lib/winston/transports";
const { colorize, combine, json, printf, simple } = format;

type Then<T> = T extends PromiseLike<infer U> ? U : T;
type Middleware = Then<ReturnType<typeof express.makeMiddleware>>;

@Injectable()
export class LoggerWinston implements LoggerService {
    private logger: L;
    private middlewareLogger: Middleware;

    private readonly consoleTransport: ConsoleTransportInstance = new transports.Console({
        format: combine(
            colorize(),
            simple(),
            printf(context => {
                return `[${context.level}] ${context.message}`;
            })
        ),
    });

    private readonly stackdriverTransport: LoggingWinston = new LoggingWinston({
        //keyFilename:    env.GCP.SERVICE_ACCOUNT_KEY,
        serviceContext: {
            service: env.GCP.SERVICE_NAME,
            version: env.VERSION,
        },
    });

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: json(),
            defaultMeta: {
                service: env.GCP.SERVICE_NAME,
                version: env.VERSION,
            },
            transports: [env.LOGGING_TARGET === "audit_log" ? this.stackdriverTransport : this.consoleTransport],
        });
    }

    async getMiddleware(): Promise<Middleware> {
        if (!this.middlewareLogger) this.middlewareLogger = await express.makeMiddleware(this.logger);
        return this.middlewareLogger;
    }

    verbose(message: any, context?: string) {
        this.logger.verbose(message);
    }

    debug(message: any, context?: string) {
        this.logger.debug(message);
    }

    log(message: any, context?: string) {
        this.logger.info(message);
    }

    warn(message: any, context?: string) {
        this.logger.warn(message);
    }

    error(message: any, stack?: string, context?: string) {
        let log;
        switch (typeof message) {
            case "string":
                log = message;
                break;
            case "undefined":
                log = "undefined error message";
                break;
            case "object":
                if (message === null) log = "null error message";
                else {
                    if (message.message) log = message.message;
                    else log = message.toString();
                    if (message.stack) stack = message.stack;
                }
                break;
            default:
                log = message.toString();
                break;
        }
        if (stack) log = log + "\n" + stack;
        this.logger.error(log);
        // eslint-disable-next-line prefer-rest-params
        //super.error.apply(this, arguments);
    }
}

//export const Logger = env.NODE_ENV === "production" ? new LoggerWinston() : null;
