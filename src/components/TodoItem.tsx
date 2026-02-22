import { Todo } from '../types/todo'
import TrashIcon from './TrashIcon'
import styles from './TodoItem.module.css'

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
          aria-label={`${todo.text}を完了としてマーク`}
        />
        <span className={todo.completed ? styles.completedText : styles.text}>
          {todo.text}
        </span>
      </label>
      <button
        onClick={() => onDelete(todo.id)}
        className={styles.deleteButton}
        aria-label={`${todo.text}を削除`}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
