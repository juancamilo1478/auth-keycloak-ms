import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){
    }

    async findUser(id:string){
        return this.userRepository.findOne({
            where:{id}
        })
    }

    async createUser(email:string, password:string){
        return this.userRepository.save({
            email,
            password
        });
    }

    
}
