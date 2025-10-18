
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys/user';
import { AuthModule } from './auth/auth.module';
import { envs } from './config';
@Module({
  imports: [
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
      schema:'auth_ms'
    }),
     AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
