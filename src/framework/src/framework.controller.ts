import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { FrameworkService } from './framework.service';
import { CreateFrameworkDto } from './dtos/create-framework.dto';
import { UpdateFrameworkDto } from './dtos/update-framework.dto';
import { IFramework } from './framework.interface';
import { ClientSession, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

/**
 * Controller responsible for handling user-related HTTP requests.
 */

@Controller('framework')
export class FrameworkController {
  constructor(
    private readonly frameworkService: FrameworkService,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  /**
   * Creates a new framework.
   * @param response HTTP response object.
   * @param createFrameworkDto Data for creating the framework.
   */
  @Post()
  async createFramework(
    @Res() response,
    @Body() createFrameworkDto: CreateFrameworkDto,
  ) {
    const session = await this.connection.startSession()
    try {

      session.startTransaction();
      const isFrameworkTitleDuplicate =
        await this.frameworkService.isFrameworkNameDuplicate(
          createFrameworkDto.frameworkTitle,
        );

      if (isFrameworkTitleDuplicate) {
        await session.abortTransaction();
        return response.status(HttpStatus.CONFLICT).json({
          status: 'error',
          message: 'Framework Title already exists',
        });
      }

      const newFramework = await this.frameworkService.createFramework(
        createFrameworkDto,
        session,
      );

      await session.commitTransaction();
      session.endSession();
      return response.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Framework has been created successfully',
        data: newFramework,
      });
    } catch (err) {
      if (session) {
        session.endSession();
      }
      console.log('error', err);
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: 'Oops something went wrong' });
    }
  }

  /**
   * Updates a framework by frameworkId.
   * @param response The response object framework to send HTTP responses.
   * @param userId The ID of the framework to update.
   * @param updateFrameworkDto The data object containing updated framework information.
   * @returns A JSON response indicating the success or failure of the operation.
   */
  @Put('/:id')
  async updateFramework(
    @Res() response,
    @Param('id') frameworkId: string,
    @Body() updateFrameworkDto: UpdateFrameworkDto,
  ) {
    let session: ClientSession;
    try {
      session = await this.connection.startSession();
      session.startTransaction();

      if (updateFrameworkDto.frameworkTitle) {
        const isFrameworkTitleDuplicate =
          await this.frameworkService.isFrameworkNameDuplicate(
            updateFrameworkDto.frameworkTitle,
            updateFrameworkDto.frameworkCategory,
          );
        if (isFrameworkTitleDuplicate) {
          await session.abortTransaction();
          await session.endSession();
          return response.status(HttpStatus.CONFLICT).json({
            status: 'error',
            message: 'Framework Title already exists',
          });
        }
      }

      // Update the framework
      const existingFrameWork = await this.frameworkService.updateFramework(
        frameworkId,
        updateFrameworkDto,
        session,
      );

      await session.commitTransaction();
      await session.endSession();

      // Send success response
      return response.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Framework has been successfully updated',
        data: existingFrameWork,
      });
    } catch (err) {
      if (session) {
        await session.abortTransaction();
        await session.endSession();
      }
      console.error('framework update error', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Oops something went wrong',
      });
    }
  }


  /**
   * Retrieves all framework  '.
   * @param response The response object used to send HTTP responses.
   * @returns A JSON response with status, message, and framework data.
   */
  @Get('')
  async getActiveFramework(@Res() response) {
    try {
      const framework: IFramework[] =
        await this.frameworkService.getAllActiveFramework();

      // Set response status and message
      const status = 'success';
      const message = framework
        ? 'Framework found successfully'
        : 'Framework not found';

      // Send JSON response with status, message, and framework data
      return response.status(HttpStatus.OK).json({
        status,
        message,
        data: framework,
      });
    } catch (err) {
      // Log error for debugging
      console.log('err', err);
      // Send error response
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: `Oops! Something went wrong. ${err}`,
      });
    } finally {
    }
  }

  /**
   * Retrieves all framework'.
   * @param response The response object used to send HTTP responses.
   * @returns A JSON response with status, message, and framework data.
   */
  @Get('/get-framework-options')
  async getFrameworkDropDown(@Res() response) {
    try {
      let framework: IFramework[] =
        await this.frameworkService.getFrameWorkDropDown();

      // Set response status and message
      const status = 'success';
      const message = framework
        ? 'Framework found successfully'
        : 'Framework not found';

      // Send JSON response with status, message, and framework data
      return response.status(HttpStatus.OK).json({
        status,
        message,
        data: framework,
      });
    } catch (err) {
      // Log error for debugging
      console.log('err', err);
      // Send error response
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: `Oops! Something went wrong. ${err}`,
      });
    } finally {
    }
  }

}
