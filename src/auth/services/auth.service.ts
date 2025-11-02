import { Injectable,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { Repository } from 'typeorm';
 
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from '../dto/User.dto';
 

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService,
       
    ) {
    }


    async findUser(id: string) {
        return this.userRepository.findOne({
            where: { id }
        })
    }

  
    

    

   

    async example() {
        return { message: 'example response from auth-ms' }
    }

}
