import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { Todo, Priority } from './types/todo'
import { api } from './services/api'

type SortOption = 'none' | 'dueDate' | 'priority'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('none')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初回読み込み
  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTodos = await api.getTodos()
      setTodos(fetchedTodos)
    } catch (err) {
      setError('Failed to load todos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text: string, dueDate?: Date, priority?: Priority) => {
    try {
      const newTodo = await api.createTodo(text, dueDate, priority)
      setTodos([newTodo, ...todos])
    } catch (err) {
      setError('Failed to add todo')
      console.error(err)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      const updatedTodo = await api.updateTodo(id, { completed: !todo.completed })
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (err) {
      setError('Failed to toggle todo')
      console.error(err)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
      console.error(err)
    }
  }

  const editTodo = async (id: string, newText: string) => {
    try {
      const updatedTodo = await api.updateTodo(id, { text: newText })
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (err) {
      setError('Failed to edit todo')
      console.error(err)
    }
  }

  const reorderTodos = (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos)
  }

  const getSortedTodos = () => {
    const todosCopy = [...todos]

    switch (sortBy) {
      case 'dueDate':
        return todosCopy.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return todosCopy.sort((a, b) => {
          const aPriority = a.priority ? priorityOrder[a.priority] : 3
          const bPriority = b.priority ? priorityOrder[b.priority] : 3
          return aPriority - bPriority
        })
      default:
        return todosCopy
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-xl">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-5xl mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-bold">
          TODO App
        </h1>
        {totalCount > 0 && (
          <p className="text-base opacity-80">
            完了: {completedCount} / {totalCount}
          </p>
        )}
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline"
          >
            閉じる
          </button>
        </div>
      )}

      <TodoForm onAdd={addTodo} />

      <div className="flex items-center gap-2 mb-4 p-4 bg-primary/10 rounded-lg">
        <label htmlFor="sortBy" className="text-sm font-bold">並び替え: </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-2 py-2 border border-primary rounded text-base bg-white"
        >
          <option value="none">なし</option>
          <option value="dueDate">期限順</option>
          <option value="priority">優先度順</option>
        </select>
      </div>

      <TodoList todos={getSortedTodos()} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} onReorder={reorderTodos} />
    </div>
  )
}

export default App
