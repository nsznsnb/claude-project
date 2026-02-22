import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from './TodoList'
import { Todo } from '../types/todo'

describe('TodoList', () => {
  const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
    id: crypto.randomUUID(),
    text: 'テストタスク',
    completed: false,
    createdAt: new Date(),
    ...overrides,
  })

  it('TODOが空の場合、空のメッセージが表示される', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('1つのTODOが正しく表示される', () => {
    const todos = [createMockTodo({ text: 'タスク1' })]
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={todos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
  })

  it('複数のTODOが正しく表示される', () => {
    const todos = [
      createMockTodo({ text: 'タスク1' }),
      createMockTodo({ text: 'タスク2' }),
      createMockTodo({ text: 'タスク3' }),
    ]
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={todos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.getByText('タスク3')).toBeInTheDocument()
  })

  it('TODOのチェックボックスをクリックすると、onToggleが呼ばれる', async () => {
    const user = userEvent.setup()
    const todos = [createMockTodo({ id: 'test-id', text: 'トグルテスト' })]
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={todos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledWith('test-id')
  })

  it('TODOの削除ボタンをクリックすると、onDeleteが呼ばれる', async () => {
    const user = userEvent.setup()
    const todos = [createMockTodo({ id: 'test-id', text: '削除テスト' })]
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={todos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /削除/ })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('test-id')
  })

  it('完了済みと未完了のTODOが混在して表示される', () => {
    const todos = [
      createMockTodo({ text: '未完了タスク', completed: false }),
      createMockTodo({ text: '完了済みタスク', completed: true }),
    ]
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoList todos={todos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText('未完了タスク')).toBeInTheDocument()
    expect(screen.getByText('完了済みタスク')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
    expect(checkboxes[0].checked).toBe(false)
    expect(checkboxes[1].checked).toBe(true)
  })
})
