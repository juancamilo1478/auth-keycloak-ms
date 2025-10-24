import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { NatsModule } from 'src/auth/transport/nast.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
 
@Module({
  imports: [
    HttpModule,
    NatsModule,
    TypeOrmModule.forFeature([User]),

    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
