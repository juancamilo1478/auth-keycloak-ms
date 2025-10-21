
import 'dotenv/config';
import * as joi from 'joi';
interface EnvVars {
    PORT: number;
    JWT_SECRET: string;
    NATS_SERVERS: string[];
    HOST:string;
    POSTGRES_USER:string;
    POSTGRES_PASSWORD:string;
    DB_NAME:string;
    KRATOS_URL:string;
}

const envsShema = joi.object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    HOST: joi.string().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    KRATOS_URL:joi.string().required()
}).unknown(true);

const { error, value } = envsShema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    jwtSecret: envVars.JWT_SECRET,
    host: envVars.HOST,
    postgresUser: envVars.POSTGRES_USER,
    postgresPassword: envVars.POSTGRES_PASSWORD,
    dbName: envVars.DB_NAME,
    kratosurl:envVars.KRATOS_URL
}