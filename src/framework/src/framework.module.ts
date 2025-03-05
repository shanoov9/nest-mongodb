import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FrameworkSchema } from './framework.schema';
import { FrameworkController } from './framework.controller';
import { FrameworkService } from './framework.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Framework', schema: FrameworkSchema }
    ]),
  ],
  controllers: [FrameworkController],
  providers: [
    FrameworkService
  ],
  exports: [FrameworkService],
})
export class FrameworkModule { }
