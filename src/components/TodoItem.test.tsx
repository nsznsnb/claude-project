import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem'
import { Todo } from '../types/todo'

describe('TodoItem', () => {
  const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
    id: '1',
    text: 'テストタスク',
    completed: false,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  })

  it('TODOのテキストが表示される', () => {
    const todo = createMockTodo({ text: '表示されるテキスト' })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText('表示されるテキスト')).toBeInTheDocument()
  })

  it('未完了のTODOのチェックボックスがチェックされていない', () => {
    const todo = createMockTodo({ completed: false })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('完了済みのTODOのチェックボックスがチェックされている', () => {
    const todo = createMockTodo({ completed: true })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('チェックボックスをクリックすると、onToggleが正しいIDで呼ばれる', async () => {
    const user = userEvent.setup()
    const todo = createMockTodo({ id: 'test-id-123' })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledWith('test-id-123')
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('削除ボタンをクリックすると、onDeleteが正しいIDで呼ばれる', async () => {
    const user = userEvent.setup()
    const todo = createMockTodo({ id: 'test-id-456' })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /削除/ })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('test-id-456')
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  it('完了済みのTODOには取り消し線が表示される', () => {
    const todo = createMockTodo({ completed: true, text: '完了済みタスク' })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    const { container } = render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const textElement = screen.getByText('完了済みタスク')
    expect(textElement).toHaveClass('completedText')
  })

  it('未完了のTODOには取り消し線が表示されない', () => {
    const todo = createMockTodo({ completed: false, text: '未完了タスク' })
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(<TodoItem todo={todo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const textElement = screen.getByText('未完了タスク')
    expect(textElement).toHaveClass('text')
    expect(textElement).not.toHaveClass('completedText')
  })
})
