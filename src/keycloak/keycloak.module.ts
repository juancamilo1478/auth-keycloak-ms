import { Module } from '@nestjs/common';
import { KeycloakService } from './services/keycloak.service';
import { KeycloakController } from './controllers/keycloak.controller';
import { HttpModule } from '@nestjs/axios';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { NatsModule } from 'src/transport/nast.module';

@Module({
  imports: [HttpModule,
    NatsModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2d' }
    })
  ],
  controllers: [KeycloakController],
  providers: [KeycloakService],
})
export class KeycloakModule { }
