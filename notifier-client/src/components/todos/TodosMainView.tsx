import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useState, useEffect } from 'react'

import { useAuth } from '../../context/AuthContext'
import { createTodoItem } from '../../services/api/createTodoItem'
import { createTodoSet } from '../../services/api/createTodoSet'
import { deleteTodoItem } from '../../services/api/deleteTodoItem'
import { getTodoItems } from '../../services/api/getTodo'
import { updateTodoItem } from '../../services/api/updateTodoItem'
import { updateTodoSetBatch } from '../../services/api/updateTodoSets'
import { TodoItem } from '../../utils/models/TodoItem'
import { TodoSet, TodoSetWithItems } from '../../utils/models/TodoSetsWithItems'

import styles from './TodosMainView.module.css'
import { TodoSetPartial } from './components/TodoSetPartial'

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
        if (result.data.every((set) => set.displayOrder === 0)) {
          // if somehow the display order for every item is 0,
          // then just set it to a temporary value (here, the index) until the user starts reordering
          result.data.map((set, index) => {
            set.displayOrder = index
          })
        }
        const sortedTodoSets = result.data.sort((a, b) => a.displayOrder - b.displayOrder)
        setTodoSets(sortedTodoSets)
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
      displayOrder: 0,
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

  const handleUpdateTodoItem = async (updatedItem: TodoItem): Promise<boolean> => {
    const result = await updateTodoItem(updatedItem)
    if (result.success && result.data) {
      setTodoSets(
        todoSets.map((set) =>
          set.todoSetId === updatedItem.todoSetId
            ? {
                ...set,
                items: set.items?.map((item) =>
                  item.todoItemId === updatedItem.todoItemId ? updatedItem : item
                ),
              }
            : set
        )
      )
      return true
    } else {
      alert('Could not update todo item. Please try again.')
      return false
    }
  }

  const handleDeleteTodoItem = async (todoItemId: number): Promise<boolean> => {
    const result = await deleteTodoItem(todoItemId)
    if (result.success && result.data) {
      const updatedTodoSets = todoSets.map((set) =>
        set.todoSetId === result.data?.todoSetId
          ? {
              ...set,
              items: set.items?.map((item) =>
                item.todoItemId === result.data?.todoItemId ? result.data : item
              ),
            }
          : set
      )
      setTodoSets(updatedTodoSets)
      return true
    }
    return false
  }
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = todoSets.findIndex((set) => set.todoSetId?.toString() === active.id)
    const newIndex = todoSets.findIndex((set) => set.todoSetId?.toString() === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newTodoSets = [...todoSets]
    const [movedSet] = newTodoSets.splice(oldIndex, 1)
    newTodoSets.splice(newIndex, 0, movedSet)

    // Update display order for all sets
    const updatedTodoSets = newTodoSets.map((set, index) => ({
      ...set,
      displayOrder: index,
    }))

    setTodoSets(updatedTodoSets)
    // TODO: Add API call to update display order on the backend
    await updateTodoSetBatch(updatedTodoSets)
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
      <DndContext
        onDragEnd={(event) => {
          void handleDragEnd(event)
        }}
      >
        <div className={styles.todoSets}>
          {todoSets.map((set, index) => (
            <TodoSetPartial
              key={set.todoSetId ?? index}
              set={set}
              index={index}
              newItemContents={newItemContents}
              setNewItemContents={setNewItemContents}
              handleToggleItem={(todoSetId, todoItemId) =>
                void handleToggleItem(todoSetId, todoItemId)
              }
              handleAddItem={(todoSetId) => void handleAddItem(todoSetId)}
              handleUpdateTodoItem={(updatedItem) => handleUpdateTodoItem(updatedItem)}
              handleDeleteTodoItem={(todoItemId) => handleDeleteTodoItem(todoItemId)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}
