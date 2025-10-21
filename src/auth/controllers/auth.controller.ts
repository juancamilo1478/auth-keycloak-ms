import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/User.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @MessagePattern('auth-ms.example')
  edituser() {
    return this.authService.example();
  }

  @MessagePattern('auth-ms.register')
  register(@Payload() createUserDto: CreateUserDto) {
    
  }
}
