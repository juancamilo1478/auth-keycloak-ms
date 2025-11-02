import { Module } from '@nestjs/common';
import { KeycloakService } from './services/keycloak.service';
import { KeycloakController } from './controllers/keycloak.controller';
import { HttpModule } from '@nestjs/axios';
import { NatsModule } from 'src/auth/transport/nast.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';

@Module({
  imports: [HttpModule,
    NatsModule,
    TypeOrmModule.forFeature([User]),],
  controllers: [KeycloakController],
  providers: [KeycloakService],
})
export class KeycloakModule { }
