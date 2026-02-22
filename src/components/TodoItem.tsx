import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '../types/todo'
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  const getPriorityClass = () => {
    if (!todo.priority) return ''
    switch (todo.priority) {
      case 'high':
        return 'bg-red-600 text-white'
      case 'medium':
        return 'bg-yellow-400 text-black'
      case 'low':
        return 'bg-green-600 text-white'
      default:
        return ''
    }
  }

  if (isEditing) {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-4 border border-primary rounded-lg mb-2 transition-colors bg-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 px-2 py-2 border-2 border-primary rounded text-base bg-gray-900 text-white"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white border-none py-2 px-4 ml-2 rounded hover:bg-green-700 transition-colors"
        >
          保存
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-600 text-white border-none py-2 px-4 ml-2 rounded hover:bg-gray-700 transition-colors"
        >
          キャンセル
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 border border-primary rounded-lg mb-2 transition-colors bg-white hover:bg-primary/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      layout
    >
      <div className="cursor-grab active:cursor-grabbing text-gray-400 p-2 mr-2 flex items-center" {...attributes} {...listeners}>
        <FaGripVertical />
      </div>
      <div className="flex-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 cursor-pointer"
            aria-label={`${todo.text}を完了としてマーク`}
          />
          <span className={todo.completed ? 'text-base text-left line-through opacity-60' : 'text-base text-left'}>
            {todo.text}
          </span>
        </label>
        <div className="flex flex-col gap-1 text-sm mt-2">
          {todo.priority && (
            <span className={`inline-block py-1 px-2 rounded text-xs font-bold ${getPriorityClass()}`}>
              {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
            </span>
          )}
          {todo.dueDate && (
            <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>
              期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
              {isOverdue && ' (期限切れ)'}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="bg-primary text-white border-none py-2 px-4 ml-2 rounded hover:bg-primary-hover transition-colors"
        aria-label={`${todo.text}を編集`}
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="bg-red-600 text-white border-none py-2 px-4 ml-2 rounded hover:bg-red-700 transition-colors"
        aria-label={`${todo.text}を削除`}
      >
        <FaTrash />
      </button>
    </motion.div>
  )
}
