import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { NatsModule } from 'src/transport/nast.module';
import { envs } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    NatsModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2d' }
    })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
