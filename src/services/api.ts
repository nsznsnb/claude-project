import { Todo, Priority } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // 全TODO取得
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const data = await response.json();
    return data.map((todo: any) => ({
      ...todo,
      id: todo._id,
      createdAt: new Date(todo.createdAt),
      updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    }));
  },

  // TODO作成
  async createTodo(text: string, dueDate?: Date, priority?: Priority): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, dueDate, priority }),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
  },

  // TODO更新
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
  },

  // TODO削除
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};
