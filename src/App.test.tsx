import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('タイトルが表示される', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'TODO App' })).toBeInTheDocument()
  })

  it('初期状態では空のメッセージが表示される', () => {
    render(<App />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('初期状態では統計が表示されない', () => {
    render(<App />)
    expect(screen.queryByText(/完了:/)).not.toBeInTheDocument()
  })

  it('TODOを追加すると、リストに表示される', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, '新しいタスク')
    await user.click(button)

    expect(screen.getByText('新しいタスク')).toBeInTheDocument()
    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument()
  })

  it('複数のTODOを追加できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'タスク1')
    await user.click(button)

    await user.type(input, 'タスク2')
    await user.click(button)

    await user.type(input, 'タスク3')
    await user.click(button)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.getByText('タスク3')).toBeInTheDocument()
  })

  it('TODOを追加すると統計が表示される', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'タスク1')
    await user.click(button)

    expect(screen.getByText('完了: 0 / 1')).toBeInTheDocument()
  })

  it('TODOを完了にすると統計が更新される', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'タスク1')
    await user.click(addButton)

    expect(screen.getByText('完了: 0 / 1')).toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(screen.getByText('完了: 1 / 1')).toBeInTheDocument()
  })

  it('TODOを削除できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })

    await user.type(input, '削除されるタスク')
    await user.click(addButton)

    expect(screen.getByText('削除されるタスク')).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: /削除/ })
    await user.click(deleteButton)

    expect(screen.queryByText('削除されるタスク')).not.toBeInTheDocument()
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('複数のTODOの完了状態を個別に管理できる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })

    await user.type(input, 'タスク1')
    await user.click(addButton)
    await user.type(input, 'タスク2')
    await user.click(addButton)
    await user.type(input, 'タスク3')
    await user.click(addButton)

    expect(screen.getByText('完了: 0 / 3')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(screen.getByText('完了: 1 / 3')).toBeInTheDocument()

    await user.click(checkboxes[2])
    expect(screen.getByText('完了: 2 / 3')).toBeInTheDocument()

    await user.click(checkboxes[0])
    expect(screen.getByText('完了: 1 / 3')).toBeInTheDocument()
  })

  it('localStorageにTODOが保存される', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const button = screen.getByRole('button', { name: '追加' })

    await user.type(input, '保存されるタスク')
    await user.click(button)

    const stored = localStorage.getItem('todos')
    expect(stored).toBeTruthy()

    const todos = JSON.parse(stored!)
    expect(todos).toHaveLength(1)
    expect(todos[0].text).toBe('保存されるタスク')
    expect(todos[0].completed).toBe(false)
  })

  it('localStorageからTODOが読み込まれる', () => {
    const mockTodos = [
      {
        id: '1',
        text: '保存済みタスク1',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: '保存済みタスク2',
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem('todos', JSON.stringify(mockTodos))

    render(<App />)

    expect(screen.getByText('保存済みタスク1')).toBeInTheDocument()
    expect(screen.getByText('保存済みタスク2')).toBeInTheDocument()
    expect(screen.getByText('完了: 1 / 2')).toBeInTheDocument()
  })

  it('localStorageのデータが壊れていても正常に起動する', () => {
    localStorage.setItem('todos', 'invalid json')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'TODO App' })).toBeInTheDocument()
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })
})
