import express, { Request, Response } from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET /api/todos - 全TODO取得
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

// POST /api/todos - TODO作成
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, dueDate, priority } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const todo = new Todo({
      text: text.trim(),
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
});

// PUT /api/todos/:id - TODO更新
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, completed, dueDate, priority } = req.body;

    const updateData: any = {};
    if (text !== undefined) updateData.text = text.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority || null;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

// DELETE /api/todos/:id - TODO削除
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

export default router;
