import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ClientSession } from 'mongoose';
import { CreateFrameworkDto } from './dtos/create-framework.dto';
import { IFramework } from './framework.interface';
import { UpdateFrameworkDto } from './dtos/update-framework.dto';


@Injectable()
export class FrameworkService {
  constructor(
    @InjectModel('Framework') private FrameworkModel: Model<IFramework>,
  ) { }

  async createFramework(
    createFrameworkDto: CreateFrameworkDto,
    session?: ClientSession,
  ): Promise<IFramework> {
    const createdFramework = new this.FrameworkModel(createFrameworkDto);

    return createdFramework.save({ session });
  }

  async updateFramework(
    userId: string,
    updateFrameworkDto: UpdateFrameworkDto,
    session?: ClientSession,
  ): Promise<IFramework> {
    const existingFramework = await this.FrameworkModel.findByIdAndUpdate(
      userId,
      updateFrameworkDto,
      { session, new: true },
    );

    return existingFramework;
  }

  async getAllActiveFramework(): Promise<IFramework[]> {
    const frameworkData = await this.FrameworkModel.find({ isDeleted: false })
      .sort({ _id: -1 })
      .exec();
    return frameworkData;
  }

  async getFrameWorkDropDown(): Promise<IFramework[]> {
    const frameworkData = await this.FrameworkModel.find({
      isActive: true,
      isDeleted: false,
    })
      .sort({ _id: -1 })
      .exec();
    return frameworkData;
  }

  async deleteFramework(
    frameworkId: string,
    session?: ClientSession,
  ): Promise<IFramework> {
    // const frameworkExist =
    //   await this.pillarsModel
    //     .find({ frameworkId: frameworkId, isActive: true, isDeleted: false })
    //     .sort({ createdAt: -1 })
    //     .exec();
    // // await this.pillarsService.getActivePillarsForDropdown(frameworkId);

    // if (frameworkExist.length > 0) {
    //   throw new Error('Framework is used in pillar');
    // }

    return this.FrameworkModel.findByIdAndUpdate(frameworkId, {
      isDeleted: true,
    }).exec();
  }

  async isFrameworkNameDuplicate(
    frameworkTitle: string,
    frameworkCategory?: string[],
  ): Promise<boolean> {
    const query: any = { frameworkTitle };
    query.isDeleted = false;
    // If frameworkCategory is provided as an array, use $in operator for matching
    if (frameworkCategory && frameworkCategory.length > 0) {
      query.frameworkCategory = { $in: frameworkCategory };
    }

    // Query the database
    const frameworkCount = await this.FrameworkModel.find(query)
      .sort({ _id: -1 })
      .exec();

    // Return true if any documents are found
    return frameworkCount.length > 0;
  }

  async getFrameWorkById(
    id: string | mongoose.Types.ObjectId,
  ): Promise<IFramework[]> {
    const frameworkData = await this.FrameworkModel.find({
      _id: id,
      isDeleted: false,
    });

    return frameworkData;
  }
  async getFrameworksByIds(frameworkIds: string[]) {
    return this.FrameworkModel
      .find({ _id: { $in: frameworkIds, isDeleted: false } })
      .select('_id frameworkTitle')
      .exec();
  }

}
