import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TodoItem } from '../../../utils/models/TodoItem'
import { TodoSetWithItems } from '../../../utils/models/TodoSetsWithItems'

import styles from './QuickTodos.module.css'

interface QuickTodosProps {
  userTodoSets: TodoSetWithItems | undefined
}
export const QuickTodos = ({ userTodoSets }: QuickTodosProps) => {
  const [todosDefault, setTodosDefault] = useState<TodoItem[]>([
    {
      TodoItemId: 1,
      TodoSetId: 1,
      Content: 'Complete project documentation',
      Completed: false,
      Deleted: false,
      CreatedAt: new Date(),
      UpdatedAt: null,
    },
    {
      TodoItemId: 2,
      TodoSetId: 1,
      Content: 'Review pull requests',
      Completed: true,
      Deleted: false,
      CreatedAt: new Date(),
      UpdatedAt: null,
    },
    {
      TodoItemId: 3,
      TodoSetId: 1,
      Content: 'Schedule team meeting',
      Completed: false,
      Deleted: false,
      CreatedAt: new Date(),
      UpdatedAt: null,
    },
  ])
  const [todoSetWithItems, setTodoSetWithItems] = useState<TodoSetWithItems | undefined>(
    userTodoSets
  )

  const navigate = useNavigate()

  const defaultTodos = (
    <div className={styles.todoList}>
      {todosDefault.map((todo) => (
        <div key={todo.TodoItemId} className={styles.todoItem}>
          <input
            type="checkbox"
            checked={todo.Completed}
            onChange={() => {
              setTodosDefault(
                todosDefault.map((t) =>
                  t.TodoItemId === todo.TodoItemId ? { ...t, Completed: !t.Completed } : t
                )
              )
            }}
          />
          <span className={todo.Completed ? styles.completed : ''}>{todo.Content}</span>
        </div>
      ))}
    </div>
  )

  const realTodos = (
    <div className={styles.todoList}>
      {todoSetWithItems &&
        todoSetWithItems.Items.map((todo) => (
          <div key={todo.TodoItemId} className={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.Completed}
              onChange={() => {
                const updatedItems = todoSetWithItems.Items.map((t) =>
                  t.TodoItemId === todo.TodoItemId ? { ...t, Completed: !t.Completed } : t
                )
                setTodoSetWithItems({
                  ...todoSetWithItems,
                  Items: updatedItems,
                })
              }}
            />
            <span className={todo.Completed ? styles.completed : ''}>{todo.Content}</span>
          </div>
        ))}
    </div>
  )

  return (
    <div>
      <h2>To-Do List</h2>
      {todoSetWithItems && todoSetWithItems.Items.length > 0 ? realTodos : defaultTodos}
      <button className={styles.navButton} onClick={() => void navigate('/todos')}>
        Go to Todos
      </button>
    </div>
  )
}
