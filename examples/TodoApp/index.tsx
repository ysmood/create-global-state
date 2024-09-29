import { useEffect, useRef } from "react";
import {
  useList,
  useTodo,
  setTodoMode,
  delTodo,
  toggleTodo,
  updateTodo,
  addTodo,
  clearCompleted,
  filters,
  setFilter,
} from "./store";

export default function TodoApp() {
  const ids = useList();
  return (
    <div>
      <h3>Todo App</h3>
      <div>
        <Filter />
        <button onClick={addTodo}>Add todo</button>
      </div>

      <div>
        {ids.map((id) => {
          return <TodoItem key={id} id={id} />;
        })}
      </div>

      <button onClick={clearCompleted}>Clear completed</button>
    </div>
  );
}

function Filter() {
  return (
    <select onChange={(e) => setFilter(e.target.value)}>
      {filters.map((f) => (
        <option key={f}>{f}</option>
      ))}
    </select>
  );
}

function TodoItem({ id }: { id: number }) {
  const { done, text, editing } = useTodo(id);

  return (
    <div>
      <label>
        <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />
      </label>

      {editing ? (
        <TodoEditor id={id} text={text} />
      ) : (
        <>
          <input value={text} readOnly style={{ borderColor: "transparent" }} />
          <button onClick={() => setTodoMode(id, true)}>Edit</button>
        </>
      )}

      <button onClick={() => delTodo(id)}>Delete</button>
    </div>
  );
}

function TodoEditor({ id, text }: { id: number; text: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <form
      style={{ display: "inline" }}
      onSubmit={(e) => {
        e.preventDefault();
        setTodoMode(id, false);
      }}
    >
      <input
        ref={ref}
        placeholder="Input text here"
        value={text}
        onChange={(e) => updateTodo(id, e.target.value)}
      />
      <input type="submit" value="Save" />
    </form>
  );
}
