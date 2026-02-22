import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
      setError('タスクの読み込みに失敗しました')
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
      setError('タスクの追加に失敗しました')
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
      setError('タスクの更新に失敗しました')
      console.error(err)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('タスクの削除に失敗しました')
      console.error(err)
    }
  }

  const editTodo = async (id: string, newText: string) => {
    try {
      const updatedTodo = await api.updateTodo(id, { text: newText })
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (err) {
      setError('タスクの編集に失敗しました')
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
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return todosCopy.sort((a, b) => {
          const aPriority = a.priority ? priorityOrder[a.priority] : 3
          const bPriority = b.priority ? priorityOrder[b.priority] : 3
          return aPriority - bPriority
        })
      }
      default:
        return todosCopy
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-black mb-2 text-gradient">
            TODO App
          </h1>
          {totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <p className="text-white/50 text-sm mb-2">
                完了: {completedCount} / {totalCount}
              </p>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto max-w-xs">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 glass rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-300 hover:text-red-100 transition-colors text-sm underline"
            >
              閉じる
            </button>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TodoForm onAdd={addTodo} />
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-5 flex-wrap"
        >
          <span className="text-white/40 text-sm">並び替え:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'none', label: 'デフォルト' },
              { value: 'dueDate', label: '期限順' },
              { value: 'priority', label: '優先度順' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  sortBy === option.value
                    ? 'btn-primary shadow-lg'
                    : 'glass text-white/50 hover:text-white/80 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TodoList
            todos={getSortedTodos()}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onReorder={reorderTodos}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default App
