import mongoose, { model, Schema } from 'mongoose';

export const TaskStatusArray = ['draft', 'published', 'archived'];
export type TaskStatus = 'draft' | 'published' | 'archived';

export interface ITask {
  _id: string;

  title: string;
  description: string;
  content: string;
  category: string;

  createdAt: Date;
  deadline: Date;
  status: TaskStatus;

  members?: string[];
  tags?: string[];
}

export interface TaskFilters {
  limit?: number;
  page?: number;

  sortBy?: string;
  sortAsc?: boolean;

  category?: string;
  tag?: string[];

  showOutdated?: boolean;

  type?: string;
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },

  createdAt: Date,
  deadline: { type: Date, required: true },
  status: { type: String, enum: TaskStatusArray, default: 'draft' },

  members: [String],
  tags: [String],
});

TaskSchema.pre('save', function (next) {
  this.createdAt = new Date();
  next();
});

export const Task = mongoose.models.Task || model<ITask>('Task', TaskSchema);
