import { useState, useEffect } from 'react'

import { useAuth } from '../../context/AuthContext'
import { createTodoItem } from '../../services/api/createTodoItem'
import { createTodoSet } from '../../services/api/createTodoSet'
import { getTodoItems } from '../../services/api/getTodo'
import { updateTodoItem } from '../../services/api/updateTodoItem'
import { TodoItem } from '../../utils/models/TodoItem'
import { TodoSet, TodoSetWithItems } from '../../utils/models/TodoSetsWithItems'

import styles from './TodosMainView.module.css'

export const TodosMainView = () => {
  const { user } = useAuth()
  const [todoSets, setTodoSets] = useState<TodoSetWithItems[]>([])
  const [newSetTitle, setNewSetTitle] = useState('')
  const [newItemContents, setNewItemContents] = useState<Record<number, string>>({})
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

    const newSet: TodoSet = {
      todoSetId: null,
      userId: Number(user.id),
      title: newSetTitle.trim(),
      archived: false,
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
    }

    const result = await createTodoSet(newSet)
    if (result.success && result.data) {
      setTodoSets([...todoSets, { ...result.data, items: [] }])
      setNewSetTitle('')
    }
  }

  const handleAddItem = async (setId: number) => {
    const content = newItemContents[setId]
    if (!content.trim()) return

    const newItem: TodoItem = {
      todoItemId: null,
      todoSetId: setId,
      content: content.trim(),
      completed: false,
      deleted: false,
      createdAt: new Date(),
      updatedAt: null,
    }

    const result = await createTodoItem(newItem)
    if (result.success && result.data) {
      const newTodoItem = result.data
      const updatedTodoSets = todoSets.map((set) =>
        set.todoSetId === setId ? { ...set, items: [...(set.items || []), newTodoItem] } : set
      )
      setTodoSets(updatedTodoSets)
      setNewItemContents((prev) => ({ ...prev, [setId]: '' }))
    }
  }

  const handleToggleItem = async (setId: number, itemId: number) => {
    const updatedTodoItem = todoSets
      .find((set) => set.todoSetId === setId)
      ?.items?.find((item) => item.todoItemId === itemId)
    if (updatedTodoItem) {
      updatedTodoItem.completed = !updatedTodoItem.completed
      const result = await updateTodoItem(updatedTodoItem)
      if (result.success && result.data) {
        setTodoSets(
          todoSets.map((set) =>
            set.todoSetId === setId
              ? {
                  ...set,
                  items: set.items?.map((item) =>
                    item.todoItemId === itemId
                      ? { ...item, completed: updatedTodoItem.completed }
                      : item
                  ),
                }
              : set
          )
        )
      } else {
        alert('Could not update todo item. Please try again.')
      }
    }
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
        {todoSets.map((set, index) => (
          <div key={index} className={styles.todoSet}>
            <h2 className={styles.setTitle}>{set.title}</h2>
            <div className={styles.items}>
              {set.items &&
                set.items.map((item, index) => {
                  return (
                    <div key={index} className={styles.todoItem}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {
                          if (set.todoSetId && item.todoItemId) {
                            void handleToggleItem(set.todoSetId, item.todoItemId)
                          }
                        }}
                      />
                      <span className={item.completed ? styles.completed : ''}>{item.content}</span>
                    </div>
                  )
                })}
            </div>

            <div className={styles.addItem}>
              <input
                type="text"
                value={newItemContents[set.todoSetId ?? 0] || ''}
                onChange={(e) => {
                  setNewItemContents((prev) => ({
                    ...prev,
                    [set.todoSetId ?? 0]: e.target.value,
                  }))
                }}
                placeholder="Add new todo item"
                className={styles.input}
              />
              <button
                onClick={() => void handleAddItem(set.todoSetId ?? 0)}
                className={styles.button}
              >
                Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
