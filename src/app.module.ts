
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys/user';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'postgres', // o 'postgres'
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'tu_contraseña',
      database: 'proyect_db',
      entities: [User], // tus entidades
      synchronize: true, // ⚠️ solo en desarrollo
      autoLoadEntities: true, // para cargar entidades automáticamente
    }),
     AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
