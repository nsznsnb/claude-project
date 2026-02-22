export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  dueDate?: Date;
  priority?: Priority;
}
