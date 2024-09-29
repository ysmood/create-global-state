import create from "create-global-state/lib/persistent";

export const filters = ["All", "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];

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

const [useStore, setStore] = create(initStore, "todo-app");

export function addTodo() {
  setStore((s) => {
    s.todos.unshift({ ...initStore.todos[0], id: s.todos.length });
  }, true);
}

export function useList() {
  return useStore((s) => {
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
  }, numbersEqual);
}

export function useTodo(id: number) {
  return useStore((s) => findTodo(s, id));
}

export function delTodo(id: number) {
  setStore((s) => {
    s.todos = s.todos.filter((todo) => todo.id !== id);
  }, true);
}

function findTodo(s: typeof initStore, id: number) {
  return s.todos.find((todo) => todo.id === id)!;
}

export function toggleTodo(id: number) {
  setStore((s) => {
    const todo = findTodo(s, id);
    if (todo) {
      todo.done = !todo.done;
    }
  }, true);
}

export function setTodoMode(id: number, editing: boolean) {
  setStore((s) => {
    const todo = findTodo(s, id);
    todo.editing = editing;
  });
}

export function updateTodo(id: number, text: string) {
  setStore((s) => {
    findTodo(s, id).text = text;
  });
}

export function clearCompleted() {
  setStore((s) => {
    s.todos = s.todos.filter((todo) => !todo.done);
  }, true);
}

export function setFilter(filter: string) {
  setStore((s) => {
    s.filter = filter as Filter;
  });
}

function numbersEqual<T>(x: T[], y: T[]) {
  return x.length === y.length && x.every((v, i) => v === y[i]);
}
