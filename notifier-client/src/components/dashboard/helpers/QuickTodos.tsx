import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { getTodoItems } from '../../../services/api/getTodo';
import { TodoItem } from '../../../utils/models/TodoItem';
import { TodoSetWithItems } from '../../../utils/models/TodoSetsWithItems';

import styles from './QuickTodos.module.css';

export const QuickTodos = () => {
  const { user } = useAuth();
  const [todoCarouselIndex, setTodoCarouselIndex] = useState(0);
  const [selectedTodoSetWithItems, setSelectedTodoSetWithItems] = useState<TodoSetWithItems>();
  const [todoSetsWithItems, setTodoSetsWithItems] = useState<TodoSetWithItems[]>([]);
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
  ]);
  useEffect(() => {
    const fetchTodos = async () => {
      console.log('fetching todos');
      if (!user?.id) return;
      const todosResult = await getTodoItems(Number(user.id));
      if (todosResult.success && todosResult.data && todosResult.data.length > 0) {
        setTodoSetsWithItems(todosResult.data);
        setSelectedTodoSetWithItems(
          todosResult.data.reduce((prev, curr) =>
            (prev.todoSetId ?? 0) > (curr.todoSetId ?? 0) ? prev : curr
          )
        );
      }
    };
    void fetchTodos();
  }, [user?.id]);

  const defaultTodos = (
    <div className={styles.todoList}>
      {todosDefault.map((todo) => (
        <div key={todo.todoItemId} className={styles.todoItem}>
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={() => {
              setTodosDefault(
                todosDefault.map((t) =>
                  t.todoItemId === todo.todoItemId ? { ...t, completed: !t.completed } : t
                )
              );
            }}
          />
          <span className={todo.completed ? styles.completed : ''}>{todo.content}</span>
        </div>
      ))}
    </div>
  );

  const realTodos = (
    <div className={styles.todoCarouselContainer}>
      {selectedTodoSetWithItems &&
        selectedTodoSetWithItems.items &&
        selectedTodoSetWithItems.items.map((todo) => (
          <div key={todo.todoItemId} className={styles.todoItem}>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => {
                const updatedItems = selectedTodoSetWithItems.items?.map((t) =>
                  t.todoItemId === todo.todoItemId ? { ...t, completed: !t.completed } : t
                );
                setSelectedTodoSetWithItems({
                  ...selectedTodoSetWithItems,
                  items: updatedItems,
                });
              }}
            />
            <span className={todo.completed ? styles.completed : ''}>{todo.content}</span>
          </div>
        ))}
    </div>
  );

  const carouselButton = (direction: 'left' | 'right') => {
    let newIndex: number;
    if (direction === 'left') {
      newIndex = todoCarouselIndex <= 0 ? todoSetsWithItems.length - 1 : todoCarouselIndex - 1;
    } else {
      newIndex = todoCarouselIndex >= todoSetsWithItems.length - 1 ? 0 : todoCarouselIndex + 1;
    }
    setTodoCarouselIndex(newIndex);
    setSelectedTodoSetWithItems(todoSetsWithItems[newIndex]);
  };

  return (
    <div className={styles.todoContainer}>
      <h2>{selectedTodoSetWithItems?.title}</h2>
      {selectedTodoSetWithItems &&
      selectedTodoSetWithItems.items &&
      selectedTodoSetWithItems.items.length > 0
        ? realTodos
        : defaultTodos}
      <div className={styles.todosButtonsContainer}>
        <div className={styles.carouselButtonContainer}>
          <button
            className={styles.carouselButton}
            onClick={() => {
              carouselButton('left');
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={styles.carouselButton}
            onClick={() => {
              carouselButton('right');
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        {/* <button className={styles.navButton} onClick={() => void navigate('/todos')}>
          Go to Todos
        </button> */}
      </div>
    </div>
  );
};
