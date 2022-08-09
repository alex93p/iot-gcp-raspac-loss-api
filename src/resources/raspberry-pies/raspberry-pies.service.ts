import { Injectable } from "@nestjs/common";
import { LoggerWinston } from "../../services/logging/logging.service";
import env from "../../env/env";
import { v4 } from "uuid";
import { protos } from "@google-cloud/iot";
import { promisify } from "util";
import { readFile as RF, unlink } from "fs";
import { exec } from "child_process";
const readFile = promisify(RF);
const bash = promisify(exec);
import { resolve } from "path";
import { v1 } from "@google-cloud/iot";
import { google } from "@google-cloud/iot/build/protos/protos";

export enum SERVICE_CODE {
    OK,
    KO,
}

export interface ICreateResponse {
    device: protos.google.cloud.iot.v1.IDevice;
    project: {
        projectId: string;
        registryRegion: string;
        registryName: string;
    };
    privateKey: string;
    privateKeyFileName: string;
    privateKeyHEX: string;
}

@Injectable()
export class RaspberryPiesService {
    constructor(private readonly loggerWinston: LoggerWinston) {}

    async create(): Promise<ServiceResponse<ICreateResponse, SERVICE_CODE.OK | SERVICE_CODE.KO>> {
        const raspacID = [
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 1),
            v4().slice(1),
        ].join("");

        const privateKeyFileName = ["private.", raspacID, ".pem"].join("");
        const publicKeyFileName = ["public.", raspacID, ".pem"].join("");
        const privateKeyPath = resolve(process.cwd(), "tmp", privateKeyFileName);
        const publicKeyPath = resolve(process.cwd(), "tmp", publicKeyFileName);
        await bash(`openssl ecparam -genkey -name prime256v1 -noout -out ${privateKeyPath}`);
        await bash(`openssl ec -in ${privateKeyPath} -pubout -out ${publicKeyPath}`);
        const privateKey = (await readFile(privateKeyPath)).toString();
        const publicKey = (await readFile(publicKeyPath)).toString();
        const { stdout, stderr } = await bash(`openssl ec -in ${privateKeyPath} -noout -text`);
        const [, privTail] = stdout.toString().split("priv:");
        const [priv] = privTail.split("pub:");
        const privateKeyHEX = priv.replace(/\\n/g, "").replace(/\s/g, "");

        const metadata = {};
        const config = {};
        const client = new v1.DeviceManagerClient();
        const [response] = await client.createDevice({
            parent: client.registryPath(env.GCP.PROJECT_ID, env.GCP.IOT_CORE_REGISTRY_REGION, env.GCP.IOT_CORE_REGISTRY_NAME),
            device: {
                id: raspacID,
                credentials: [
                    {
                        publicKey: {
                            format: env.GCP.IOT_CORE_REGISTRY_DEVICE_PUBLIC_KEY_FORMAT as
                                | google.cloud.iot.v1.PublicKeyFormat
                                | keyof typeof google.cloud.iot.v1.PublicKeyFormat
                                | null,
                            key: publicKey,
                        },
                    },
                ],
                metadata: metadata,
                config: {
                    binaryData: Buffer.from(JSON.stringify(config)).toString("base64"),
                },
            },
        });

        try {
            unlink(privateKeyPath, () => {});
        } catch (e) {
            this.loggerWinston.error(e);
        }
        try {
            unlink(publicKeyPath, () => {});
        } catch (e) {
            this.loggerWinston.error(e);
        }

        return {
            code: SERVICE_CODE.OK,
            data: {
                device: response,
                project: {
                    projectId: env.GCP.PROJECT_ID,
                    registryRegion: env.GCP.IOT_CORE_REGISTRY_REGION,
                    registryName: env.GCP.IOT_CORE_REGISTRY_NAME,
                },
                privateKey: privateKey,
                privateKeyFileName: privateKeyFileName,
                privateKeyHEX: privateKeyHEX,
            },
        };
    }
}
