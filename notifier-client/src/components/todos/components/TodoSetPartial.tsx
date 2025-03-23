import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { TodoSetWithItems } from '../../../utils/models/TodoSetsWithItems'
import styles from '../TodosMainView.module.css'

interface TodoSetProps {
  set: TodoSetWithItems
  index: number
  newItemContents: Record<number, string>
  setNewItemContents: (newItemContents: Record<number, string>) => void
  handleToggleItem: (todoSetId: number, todoItemId: number) => void
  handleAddItem: (todoSetId: number) => void
}

export const TodoSetPartial = ({
  set,
  index,
  newItemContents,
  setNewItemContents,
  handleToggleItem,
  handleAddItem,
}: TodoSetProps) => {
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

  console.log(set.displayOrder)

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

  return (
    <div ref={setNodeRef} style={style} className={styles.todoSet}>
      <div className={styles.setTitleWrapper} {...attributes} {...listeners}>
        <h2 className={styles.setTitle}>{set.title}</h2>
        <div className={styles.dragHandle}>⋮⋮</div>
      </div>
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
                      handleToggleItem(set.todoSetId, item.todoItemId)
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
