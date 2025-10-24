import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, loginPasswordDto } from '../dto/User.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @MessagePattern('auth-ms.example')
  edituser() {
    return this.authService.example();
  }

  @MessagePattern('auth-ms.register')
  register(@Payload() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @MessagePattern('auth-ms.login-password')
  login(@Payload() loginPasswordDto: loginPasswordDto) {
    return this.authService.login(loginPasswordDto)
  }
  @MessagePattern('auth-ms.check-session')
  checkSession(@Payload() { token }: { token: string }) {
    console.log("la session es " + token)
    return this.authService.chekSession(token)
  }

  @MessagePattern('auth-ms.create-admin')
  createAdmin(){
    return this.authService.createAdmin()
  }
}
