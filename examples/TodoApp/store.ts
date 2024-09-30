import create from "create-global-state/lib/persistent";
import { useEqual } from "create-global-state";

export const filters = ["All", "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];

// Define type and init value of the store
const initStore = {
  todos: [
    {
      id: 0,
      text: "",
      editing: true,
      done: false,
    },
  ],
  filter: "All" as Filter,
};

// Create a store, it uses the url hash to persist the state, the key in the url hash is "todo-app".
const [useStore, setStore] = create(initStore, "todo-app");

// Add a new empty todo to the list.
export function addTodo() {
  setStore((s) => {
    s.todos.unshift({ ...initStore.todos[0], id: s.todos.length });
  }, true);
}

// Get a new id list only when the ids of the todos change.
export function useList() {
  return useStore(
    useEqual((s) => {
      return s.todos
        .filter((todo) => {
          switch (s.filter) {
            case "All":
              return true;
            case "Active":
              return !todo.done;
            case "Completed":
              return todo.done;
          }
        })
        .map((todo) => todo.id);
    }, numbersEqual)
  );
}

// Get a todo by id.
export function useTodo(id: number) {
  return useStore((s) => findTodo(s, id));
}

// Delete a todo by id.
export function delTodo(id: number) {
  setStore((s) => {
    s.todos = s.todos.filter((todo) => todo.id !== id);
  }, true);
}

// Find a todo by id.
function findTodo(s: typeof initStore, id: number) {
  return s.todos.find((todo) => todo.id === id)!;
}

// Toggle the done state of a todo by id.
export function toggleTodo(id: number) {
  setStore((s) => {
    const todo = findTodo(s, id);
    if (todo) {
      todo.done = !todo.done;
    }
  }, true);
}

// Set the editing state of a todo by id.
export function setTodoMode(id: number, editing: boolean) {
  setStore((s) => {
    const todo = findTodo(s, id);
    todo.editing = editing;
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
    s.todos = s.todos.filter((todo) => !todo.done);
  }, true);
}

// Set the filter for filtering the todos.
export function setFilter(filter: string) {
  setStore((s) => {
    s.filter = filter as Filter;
  });
}

// Compare two arrays' equality.
function numbersEqual<T>(x: T[], y: T[]) {
  return x.length === y.length && x.every((v, i) => v === y[i]);
}
