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
      todoItemId: 1,
      todoSetId: 1,
      content: 'Complete project documentation',
      completed: false,
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      todoItemId: 2,
      todoSetId: 1,
      content: 'Review pull requests',
      completed: true,
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      todoItemId: 3,
      todoSetId: 1,
      content: 'Schedule team meeting',
      completed: false,
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
    },
  ])
  const [todoSetWithItems, setTodoSetWithItems] = useState<TodoSetWithItems | undefined>(
    userTodoSets
  )

  const navigate = useNavigate()

  const defaultTodos = (
    <div className={styles.todoList}>
      {todosDefault.map((todo) => (
        <div key={todo.todoItemId} className={styles.todoItem}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              setTodosDefault(
                todosDefault.map((t) =>
                  t.todoItemId === todo.todoItemId ? { ...t, completed: !t.completed } : t
                )
              )
            }}
          />
          <span className={todo.completed ? styles.completed : ''}>{todo.content}</span>
        </div>
      ))}
    </div>
  )

  const realTodos = (
    <div className={styles.todoList}>
      {todoSetWithItems &&
        todoSetWithItems.items &&
        todoSetWithItems.items.map((todo) => (
          <div key={todo.todoItemId} className={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                const updatedItems = todoSetWithItems.items?.map((t) =>
                  t.todoItemId === todo.todoItemId ? { ...t, completed: !t.completed } : t
                )
                setTodoSetWithItems({
                  ...todoSetWithItems,
                  items: updatedItems,
                })
              }}
            />
            <span className={todo.completed ? styles.completed : ''}>{todo.content}</span>
          </div>
        ))}
    </div>
  )

  return (
    <div>
      <h2>To-Do List</h2>
      {todoSetWithItems && todoSetWithItems.items && todoSetWithItems.items.length > 0
        ? realTodos
        : defaultTodos}
      <button className={styles.navButton} onClick={() => void navigate('/todos')}>
        Go to Todos
      </button>
    </div>
  )
}
