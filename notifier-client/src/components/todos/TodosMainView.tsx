import { useState, useEffect } from 'react'

import { useAuth } from '../../context/AuthContext'
import { createTodoItem } from '../../services/api/createTodoItem'
import { createTodoSet } from '../../services/api/createTodoSet'
import { getTodoItems } from '../../services/api/getTodo'
import { TodoItem } from '../../utils/models/TodoItem'
import { TodoSetWithItems } from '../../utils/models/TodoSetsWithItems'

import styles from './TodosMainView.module.css'

export const TodosMainView = () => {
  const { user } = useAuth()
  const [todoSets, setTodoSets] = useState<TodoSetWithItems[]>([])
  const [newSetTitle, setNewSetTitle] = useState('')
  const [newItemContent, setNewItemContent] = useState('')
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTodoSets = async () => {
      if (!user?.id) return

      const result = await getTodoItems(Number(user.id))
      if (result.success && result.data) {
        setTodoSets(result.data)
      }
      setIsLoading(false)
    }

    void fetchTodoSets()
  }, [user?.id])

  const handleCreateSet = async () => {
    if (!user?.id || !newSetTitle.trim()) return

    const newSet = {
      TodoSetId: null,
      UserId: Number(user.id),
      Title: newSetTitle.trim(),
      Deleted: false,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: null,
    }

    const result = await createTodoSet(newSet)
    if (result.success && result.data) {
      setTodoSets([...todoSets, { ...result.data, Items: [] }])
      setNewSetTitle('')
    }
  }

  const handleAddItem = async (setId: number) => {
    if (!newItemContent.trim()) return

    const newItem: TodoItem = {
      TodoItemId: null,
      TodoSetId: setId,
      Content: newItemContent.trim(),
      Completed: false,
      Deleted: false,
      CreatedAt: new Date(),
      UpdatedAt: null,
    }

    const result = await createTodoItem(newItem)
    if (result.success && result.data) {
      setTodoSets(
        todoSets.map((set) =>
          set.TodoSetId === setId ? { ...set, Items: [...set.Items, result.data!] } : set
        )
      )
      setNewItemContent('')
    }
  }

  const handleToggleItem = (setId: number, itemId: number) => {
    setTodoSets(
      todoSets.map((set) =>
        set.TodoSetId === setId
          ? {
              ...set,
              Items: set.Items.map((item) =>
                item.TodoItemId === itemId ? { ...item, Completed: !item.Completed } : item
              ),
            }
          : set
      )
    )
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Todo Sets</h1>
        <div className={styles.createSet}>
          <input
            type="text"
            value={newSetTitle}
            onChange={(e) => {
              setNewSetTitle(e.target.value)
            }}
            placeholder="New todo set title"
            className={styles.input}
          />
          <button onClick={() => void handleCreateSet()} className={styles.button}>
            Create Set
          </button>
        </div>
      </div>

      <div className={styles.todoSets}>
        {todoSets.map((set) => (
          <div key={set.TodoSetId} className={styles.todoSet}>
            <h2 className={styles.setTitle}>{set.Title}</h2>

            <div className={styles.items}>
              {set.Items.map((item) => (
                <div key={item.TodoItemId} className={styles.todoItem}>
                  <input
                    type="checkbox"
                    checked={item.Completed}
                    onChange={() => {
                      handleToggleItem(set.TodoSetId!, item.TodoItemId!)
                    }}
                  />
                  <span className={item.Completed ? styles.completed : ''}>{item.Content}</span>
                </div>
              ))}
            </div>

            <div className={styles.addItem}>
              <input
                type="text"
                value={newItemContent}
                onChange={(e) => {
                  setNewItemContent(e.target.value)
                }}
                placeholder="Add new todo item"
                className={styles.input}
              />
              <button onClick={() => void handleAddItem(set.TodoSetId!)} className={styles.button}>
                Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
