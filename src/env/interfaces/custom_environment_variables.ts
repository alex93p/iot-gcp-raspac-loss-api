/*
    https://jvilk.com/MakeTypes/
 */

const NODE_ENV_DEV = "dev" as const;
const NODE_ENV_PRODUCTION = "production" as const;
export type NODE_ENV = typeof NODE_ENV_DEV | typeof NODE_ENV_PRODUCTION;

const LOGGING_TARGET_AUDITLOG = "audit_log";
const LOGGING_TARGET_CONSOLE = "console";
export type LOGGING_TARGET = typeof LOGGING_TARGET_CONSOLE | typeof LOGGING_TARGET_AUDITLOG;

export interface custom_environment_variables {
    NODE_ENV: NODE_ENV;
    LOGGING_TARGET: LOGGING_TARGET;
    SERVER: SERVER;
    GCP: GOOGLECLOUDPLATFORM;
}

export interface SERVER {
    PORT: string;
}
export interface GOOGLECLOUDPLATFORM {
    PROJECT_ID: string;
    SERVICE_NAME: string;
    IOT_CORE_REGISTRY_REGION: string;
    IOT_CORE_REGISTRY_NAME: string;
    IOT_CORE_REGISTRY_DEVICE_PUBLIC_KEY_FORMAT: string;
}
