import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

import { TodoItem } from '../../../utils/models/TodoItem'
import { TodoSetWithItems } from '../../../utils/models/TodoSetsWithItems'
import styles from '../TodosMainView.module.css'

interface TodoSetProps {
  set: TodoSetWithItems
  index: number
  newItemContents: Record<number, string>
  setNewItemContents: (newItemContents: Record<number, string>) => void
  handleToggleItem: (todoSetId: number, todoItemId: number) => void
  handleAddItem: (todoSetId: number) => void
  handleUpdateTodoItem: (updatedItem: TodoItem) => Promise<boolean>
  handleDeleteTodoItem: (todoItemId: number) => Promise<boolean>
  handleUpdateTodoSetTitle: (todoSetId: number, title: string) => Promise<boolean>
}

export const TodoSetPartial = ({
  set,
  index,
  newItemContents,
  setNewItemContents,
  handleToggleItem,
  handleAddItem,
  handleUpdateTodoItem,
  handleDeleteTodoItem,
  handleUpdateTodoSetTitle,
}: TodoSetProps) => {
  const [clickedItem, setClickedItem] = useState<TodoItem | null>(null)

  const [itemClicked, setItemClicked] = useState<boolean>(false)
  const [titleClicked, setTitleClicked] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<boolean>(false)
  const [editingTitle, setEditingTitle] = useState<boolean>(false)
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: set.todoSetId?.toString() ?? index.toString(),
  })
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id: set.todoSetId?.toString() ?? index.toString(),
  })

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: 'transform ease-in-out',
        border: isOver ? '2px dashed #3182ce' : undefined,
      }
    : undefined

  const setNodeRef = (node: HTMLElement | null) => {
    setDroppableRef(node)
    setDraggableRef(node)
  }

  const handleItemClick = (item: TodoItem) => {
    if (clickedItem && itemClicked && clickedItem.todoItemId === item.todoItemId) {
      setEditingItem(true)
      return
    }

    if (!editingItem) {
      setClickedItem(item)
      setItemClicked(true)
      setTimeout(() => {
        setItemClicked(false)
      }, 200)
    }
  }
  const handleTitleClick = () => {
    if (titleClicked) {
      setEditingTitle(true)
      return
    }

    if (!editingTitle) {
      setTitleClicked(true)
      setTimeout(() => {
        setTitleClicked(false)
      }, 200)
    }
  }

  const handleUpdateItemContent = (item: TodoItem, content: string) => {
    setClickedItem({
      ...item,
      content,
    })
  }

  const handleSubmitItemEdit = async () => {
    if (clickedItem) {
      const success = await handleUpdateTodoItem(clickedItem)
      if (success) {
        setEditingItem(false)
      } else {
        alert('Could not update todo item. Please try again.')
      }
    }
  }
  const handleSubmitTitleEdit = async () => {
    const success = await handleUpdateTodoSetTitle(set.todoSetId ?? 0, set.title)
    if (success) {
      setEditingTitle(false)
    } else {
      alert('Could not update todo set title. Please try again.')
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.todoSet}>
      <div
        className={styles.setTitleWrapper}
        onClick={() => {
          handleTitleClick()
        }}
      >
        {editingTitle ? (
          <>
            <input
              type="text"
              className={styles.todoSetTitleEditInput}
              value={set.title}
              onChange={(e) => {
                void handleUpdateTodoSetTitle(set.todoSetId ?? 0, e.target.value)
              }}
            />
            <button
              className={styles.button}
              onClick={() => {
                void handleSubmitTitleEdit()
              }}
            >
              ✓
            </button>
          </>
        ) : (
          <h2 className={styles.setTitle}>{set.title}</h2>
        )}
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          ⋮⋮
        </div>
      </div>
      <div className={styles.items}>
        {set.items &&
          set.items.map((item, index) => {
            if (item.deleted) return null
            return (
              <div key={index} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {
                    if (set.todoSetId && item.todoItemId) {
                      handleToggleItem(set.todoSetId, item.todoItemId)
                    }
                  }}
                />
                {editingItem && clickedItem?.todoItemId === item.todoItemId ? (
                  <>
                    <input
                      type="text"
                      className={styles.todoItemEditInput}
                      value={clickedItem.content}
                      onChange={(e) => {
                        handleUpdateItemContent(item, e.target.value)
                      }}
                    />
                    <button
                      className={styles.button}
                      onClick={() => {
                        void handleSubmitItemEdit()
                      }}
                    >
                      ✓
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={item.completed ? styles.completed : ''}
                      onClick={() => {
                        handleItemClick(item)
                      }}
                    >
                      {item.content}
                    </span>
                    <button
                      className={styles.button}
                      onClick={() => {
                        if (item.todoItemId) {
                          void handleDeleteTodoItem(item.todoItemId)
                        }
                      }}
                    >
                      X
                    </button>
                  </>
                )}
              </div>
            )
          })}
      </div>

      <div className={styles.addItem}>
        <input
          type="text"
          value={newItemContents[set.todoSetId ?? 0] || ''}
          onChange={(e) => {
            setNewItemContents({
              ...newItemContents,
              [set.todoSetId ?? 0]: e.target.value,
            })
          }}
          placeholder="Add new todo item"
          className={styles.input}
        />
        <button
          onClick={() => {
            handleAddItem(set.todoSetId ?? 0)
          }}
          className={styles.button}
        >
          Add Item
        </button>
      </div>
    </div>
  )
}
