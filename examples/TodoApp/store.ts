import create from "create-global-state/lib/immer";
import { useEqual } from "create-global-state";

export const filters = ["All", "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];

// Define type and init value of the store
const initStore = {
  todos: [
    {
      id: Date.now(),
      text: "",
      done: false,
    },
  ],
  filter: "All" as Filter,
};

// Create a store, it uses the url hash to persist the state, the key in the url hash is "todo-app".
const [useStore, setStore] = create(initStore);

// Add a new empty todo to the list.
export function addTodo() {
  setStore((s) => {
    s.todos.unshift({ ...initStore.todos[0], id: Date.now() });
  });
}

// Get a new id list only when the ids of the todos change.
export function useList() {
  return useStore(
    useEqual((s) => {
      return filterTodos(s).map(({ id }) => id);
    }, numbersEqual)
  );
}

// Get the count of the left todos.
export function useCount(done?: boolean) {
  return useStore((s) => s.todos.filter(({ done: d }) => d == done).length);
}

// Get a todo by id.
export function useTodo(id: number) {
  return useStore((s) => findTodo(s, id));
}

// Get the toggleAll state.
export function useToggleAll() {
  return useStore((s) => {
    const todos = filterTodos(s);
    if (todos.length === 0) {
      return false;
    }
    return todos.every(({ done }) => done);
  });
}

// Delete a todo by id.
export function delTodo(id: number) {
  setStore((s) => {
    s.todos = s.todos.filter((todo) => todo.id !== id);
  });
}

// Toggle the done state of a todo by id.
export function toggleTodo(id: number) {
  setStore((s) => {
    const todo = findTodo(s, id);
    if (todo) {
      todo.done = !todo.done;
    }
  });
}

// Toggle all the current filtered todos.
export function toggleAll() {
  setStore((s) => {
    const todos = filterTodos(s);
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

// Update the text of a todo by id.
export function updateTodo(id: number, text: string) {
  setStore((s) => {
    findTodo(s, id).text = text;
  });
}

// Clear all completed todos.
export function clearCompleted() {
  setStore((s) => {
    s.todos = s.todos.filter(({ done }) => !done);
  });
}

// Set the filter for filtering the todos.
export function setFilter(filter: string) {
  setStore((s) => {
    s.filter = filter as Filter;
  });
}

// Find a todo by id.
function findTodo(s: typeof initStore, id: number) {
  return s.todos.find((todo) => todo.id === id)!;
}

// Filter the todos by the current status.
function filterTodos(s: typeof initStore) {
  return s.todos.filter(({ done }) => {
    switch (s.filter) {
      case "All":
        return true;
      case "Active":
        return !done;
      case "Completed":
        return done;
    }
  });
}

// Compare two arrays' equality.
function numbersEqual<T>(x: T[], y: T[]) {
  return x.length === y.length && x.every((v, i) => v === y[i]);
}
