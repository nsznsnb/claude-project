import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from './TodoForm'

describe('TodoForm', () => {
  it('入力フィールドとボタンが表示される', () => {
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('テキストを入力して送信すると、onAddが呼ばれる', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'テストタスク')
    await user.click(button)

    expect(mockOnAdd).toHaveBeenCalledWith('テストタスク')
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
  })

  it('送信後、入力フィールドがクリアされる', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...') as HTMLInputElement
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'テストタスク')
    await user.click(button)

    expect(input.value).toBe('')
  })

  it('空白のみの入力では、onAddが呼ばれない', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, '   ')
    await user.click(button)

    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('前後の空白がトリムされる', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, '  タスク  ')
    await user.click(button)

    expect(mockOnAdd).toHaveBeenCalledWith('タスク')
  })

  it('Enterキーで送信できる', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<TodoForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')

    await user.type(input, 'Enterで送信{Enter}')

    expect(mockOnAdd).toHaveBeenCalledWith('Enterで送信')
  })
})
