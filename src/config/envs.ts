import 'dotenv/config';
import * as joi from 'joi';

// 1️⃣ Interfaz para tipar las variables
interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  NATS_SERVERS: string[];
  HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  DB_NAME: string;
  GOOGLE_CLIENT_ID: string;

  // --- Keycloak ---
  KEYCLOAK_DOMAIN: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_LOGIN_URL: string;
  KEYCLOAK_ADMIN_BASE_URL: string;
  KEYCLOAK_ADMIN_CLIENT_ID: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
  KEYCLOAK_ADMIN_LINK_LIFESPAN: number;
  KEYCLOAK_ADMIN_REDIRECT_URI: string;
  KEYCLOAK_CLIENT_LOGIN_CLIENT_ID: string;
  KEYCLOAK_CLIENT_LOGIN_CLIENT_SECRET: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  KEYCLOAK_CLIENT_SECRET: string;
   
}

// 2️⃣ Validación con Joi
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    HOST: joi.string().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
   
    // --- Keycloak ---
    KEYCLOAK_DOMAIN: joi.string().uri().required(),
    KEYCLOAK_REALM: joi.string().required(),
    KEYCLOAK_CLIENT_ID: joi.string().required(),
    KEYCLOAK_LOGIN_URL: joi.string().uri().required(),
    KEYCLOAK_ADMIN_BASE_URL: joi.string().uri().required(),
    KEYCLOAK_ADMIN_CLIENT_ID: joi.string().required(),
    KEYCLOAK_ADMIN_CLIENT_SECRET: joi.string().required(),
    KEYCLOAK_ADMIN_LINK_LIFESPAN: joi.number().required(),
    KEYCLOAK_ADMIN_REDIRECT_URI: joi.string().uri().required(),
    KEYCLOAK_CLIENT_LOGIN_CLIENT_ID: joi.string().required(),
    KEYCLOAK_CLIENT_LOGIN_CLIENT_SECRET: joi.string().required(),
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().required(),
    KEYCLOAK_CLIENT_SECRET: joi.string().required(),
  })
  .unknown(true); // permite otras variables

// 3️⃣ Validar el entorno actual
const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

// 4️⃣ Exportar las variables ya tipadas y limpias
export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  natsServers: envVars.NATS_SERVERS,
  host: envVars.HOST,
  postgresUser: envVars.POSTGRES_USER,
  postgresPassword: envVars.POSTGRES_PASSWORD,
  dbName: envVars.DB_NAME,
  googleClientId: envVars.GOOGLE_CLIENT_ID,

  // --- Keycloak ---
  keycloak: {
    domain: envVars.KEYCLOAK_DOMAIN,
    realm: envVars.KEYCLOAK_REALM,
    clientId: envVars.KEYCLOAK_CLIENT_ID,
    clientSecret: envVars.KEYCLOAK_CLIENT_SECRET,
    loginUrl: envVars.KEYCLOAK_LOGIN_URL,
    adminBaseUrl: envVars.KEYCLOAK_ADMIN_BASE_URL,
    adminClientId: envVars.KEYCLOAK_ADMIN_CLIENT_ID,
    adminClientSecret: envVars.KEYCLOAK_ADMIN_CLIENT_SECRET,
    adminLinkLifespan: envVars.KEYCLOAK_ADMIN_LINK_LIFESPAN,
    adminRedirectUri: envVars.KEYCLOAK_ADMIN_REDIRECT_URI,
    clientLOGINId: envVars.KEYCLOAK_CLIENT_LOGIN_CLIENT_ID,
    clientLOGINSecret: envVars.KEYCLOAK_CLIENT_LOGIN_CLIENT_SECRET,
    
  },

  // --- Database ---
  databaseHost: envVars.DATABASE_HOST,
  databasePort: envVars.DATABASE_PORT,
};
