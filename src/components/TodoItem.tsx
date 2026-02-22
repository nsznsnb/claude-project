import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Todo } from '../types/todo'
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa'

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
}

const priorityConfig = {
  high: { label: '高', className: 'bg-red-500/15 text-red-300 border border-red-500/25' },
  medium: { label: '中', className: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
  low: { label: '低', className: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' },
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
  }

  const handleSave = () => {
    if (editText.trim() && onEdit) {
      onEdit(todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-4 mb-3 group hover:bg-white/[0.1] transition-colors shadow-sm"
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 px-4 py-2 glass-input rounded-xl text-base"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-colors border border-emerald-500/25 text-sm font-medium"
              aria-label="保存"
            >
              保存
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="px-4 py-2 glass text-white/50 rounded-xl hover:text-white/70 transition-colors text-sm font-medium"
              aria-label="キャンセル"
            >
              キャンセル
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3"
          >
            {/* Drag Handle */}
            <div
              className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing transition-colors flex-shrink-0"
              {...attributes}
              {...listeners}
            >
              <FaGripVertical className="w-4 h-4" />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="w-5 h-5 flex-shrink-0 rounded accent-indigo-500 cursor-pointer"
                aria-label={`${todo.text}を完了としてマーク`}
              />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <span className={todo.completed ? 'completedText text-sm leading-relaxed line-through text-white/30 transition-all' : 'text text-sm leading-relaxed text-white/85 transition-all'}>
                  {todo.text}
                </span>
                {(todo.priority || todo.dueDate) && (
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {todo.priority && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[todo.priority].className}`}>
                        {priorityConfig[todo.priority].label}
                      </span>
                    )}
                    {todo.dueDate && (
                      <span className={`text-xs ${isOverdue ? 'text-red-400 font-medium' : 'text-white/35'}`}>
                        {isOverdue && '⚠ '}期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  aria-label={`${todo.text}を編集`}
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(todo.id)}
                className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label={`${todo.text}を削除`}
              >
                <FaTrash className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
