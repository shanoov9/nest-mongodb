import { Document } from 'mongoose';

export interface IFramework extends Document {
  readonly frameworkTitle: string;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
  readonly frameworkCategory: string[];
}
