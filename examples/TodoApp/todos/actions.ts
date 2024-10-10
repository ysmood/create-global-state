import { getFilter, useFilter } from "./filter";
import { filterTodos, initTodo, setTodos, useTodos } from ".";

// Add a new empty todo to the list.
export function addTodo() {
  setTodos((todos) => {
    todos.unshift({ ...initTodo, id: Date.now() });
  });
}

// Clear all completed todos.
export function clearCompleted() {
  setTodos((todos) => todos.filter(({ done }) => !done));
}

// Get the toggleAll state.
export function useToggleAll() {
  const filter = useFilter();
  return useTodos((todos) => {
    todos = filterTodos(todos, filter);
    if (todos.length === 0) {
      return false;
    }
    return todos.every(({ done }) => done);
  });
}

// Toggle all the current filtered todos.
export function toggleAll() {
  setTodos((todos) => {
    todos = filterTodos(todos, getFilter());
    if (todos.every(({ done }) => done)) {
      todos.forEach((todo) => {
        todo.done = false;
      });
    } else {
      todos.forEach((todo) => {
        todo.done = true;
      });
    }
  });
}
