import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FrameworkModule } from './framework/src/framework.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://shanoov9:jrw7TP08lxu8xk3i@cluster0.fjsvzks.mongodb.net/?retryWrites=true&w=majority`),
    UsersModule,
    FrameworkModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
