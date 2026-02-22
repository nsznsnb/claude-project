import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
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
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 mb-5 shadow-xl">
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-3 glass-input rounded-xl text-base"
          aria-label="新しいタスク"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, translateY: -1 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 btn-primary rounded-xl font-semibold whitespace-nowrap shadow-lg"
        >
          追加
        </motion.button>
      </div>

      <div className="flex gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <label htmlFor="dueDate" className="text-white/40 text-sm whitespace-nowrap">期限:</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-2 glass-input rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <label htmlFor="priority" className="text-white/40 text-sm whitespace-nowrap">優先度:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | '')}
            className="flex-1 px-3 py-2 glass-input rounded-lg text-sm"
          >
            <option value="" className="bg-gray-900 text-white">なし</option>
            <option value="high" className="bg-gray-900 text-white">高</option>
            <option value="medium" className="bg-gray-900 text-white">中</option>
            <option value="low" className="bg-gray-900 text-white">低</option>
          </select>
        </div>
      </div>
    </form>
  )
}
