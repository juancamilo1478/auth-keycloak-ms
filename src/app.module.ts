
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys/user';
import { envs } from './config';
import { KeycloakModule } from './keycloak/keycloak.module';
import { NatsModule } from './transport/nast.module';

@Module({
  imports: [
    NatsModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // o 'postgres'
      host: envs.host,
      port: 5432,
      username: envs.postgresUser,
      password: envs.postgresPassword,
      database: envs.dbName,
      entities: [User],
      synchronize: true, // ⚠️ solo en desarrollo
      autoLoadEntities: true, // para cargar entidades automáticamente
      schema: 'auth_ms'
    }),
    KeycloakModule,
  ],

})
export class AppModule { }
