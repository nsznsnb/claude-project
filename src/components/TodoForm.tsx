import { useState, FormEvent } from 'react'
import styles from './TodoForm.module.css'

interface TodoFormProps {
  onAdd: (text: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        className={styles.input}
        aria-label="新しいタスク"
      />
      <button type="submit" className={styles.button}>
        追加
      </button>
    </form>
  )
}
