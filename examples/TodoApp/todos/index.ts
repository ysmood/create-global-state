import create from "create-global-state/lib/immer";
import { useEqual } from "create-global-state";
import { type Filter, useFilter } from "./filter";
import { numbersEqual } from "../../utils";

export const initTodo = {
  id: Date.now(),
  text: "",
  done: false,
};

export const [useTodos, setTodos] = create([initTodo]);

type Todos = (typeof initTodo)[];

// Get a todo by id.
export function useTodo(id: number) {
  return useTodos((s) => findTodo(s, id));
}

// Get a new id list only when the ids of the todos change.
export function useTodoIds() {
  const filter = useFilter();
  return useTodos(
    useEqual((todos) => {
      return filterTodos(todos, filter).map(({ id }) => id);
    }, numbersEqual)
  );
}

export function useZeroCount() {
  const filter = useFilter();
  return useTodos((todos) => {
    return filterTodos(todos, filter).map(({ id }) => id).length === 0;
  });
}

// Get the count of the left todos.
export function useLeftCount() {
  return useTodos((todos) => todos.filter(({ done }) => !done).length);
}

export function useZeroDone() {
  return useTodos((todos) => !todos.some(({ done }) => done));
}

// Update the text of a todo by id.
export function updateTodo(id: number, text: string) {
  setTodos((todos) => {
    findTodo(todos, id).text = text;
  });
}

// Toggle the done state of a todo by id.
export function toggleTodo(id: number) {
  setTodos((todos) => {
    const todo = findTodo(todos, id);
    if (todo) {
      todo.done = !todo.done;
    }
  });
}

// Delete a todo by id.
export function delTodo(id: number) {
  setTodos((todos) => todos.filter((todo) => todo.id !== id));
}

// Find a todo by id.
function findTodo(todos: Todos, id: number) {
  return todos.find((todo) => todo.id === id)!;
}

// Filter the todos by the current status.
export function filterTodos(todos: Todos, filter: Filter) {
  return todos.filter(({ done }) => {
    switch (filter) {
      case "All":
        return true;
      case "Active":
        return !done;
      case "Completed":
        return done;
    }
  });
}
