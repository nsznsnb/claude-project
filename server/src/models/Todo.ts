import mongoose, { Schema, Document } from 'mongoose';

export type Priority = 'high' | 'medium' | 'low';

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  dueDate?: Date;
  priority?: Priority;
}

const TodoSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>('Todo', TodoSchema);
