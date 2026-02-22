import { useState, FormEvent } from 'react'
import { Priority } from '../types/todo'

interface TodoFormProps {
  onAdd: (text: string, dueDate?: Date, priority?: Priority) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined
      const parsedPriority = priority || undefined
      onAdd(text.trim(), parsedDueDate, parsedPriority)
      setText('')
      setDueDate('')
      setPriority('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-8">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="w-full px-5 py-3 text-base rounded-lg border border-primary bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="新しいタスク"
      />
      <div className="flex gap-4 w-full">
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="dueDate" className="text-sm whitespace-nowrap">期限:</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-2 py-2 border border-gray-300 rounded text-base bg-gray-900 text-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="priority" className="text-sm whitespace-nowrap">優先度:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | '')}
            className="flex-1 px-2 py-2 border border-gray-300 rounded text-base bg-gray-900 text-white"
          >
            <option value="">なし</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 px-5 rounded-lg hover:bg-primary-hover transition-colors"
      >
        追加
      </button>
    </form>
  )
}
