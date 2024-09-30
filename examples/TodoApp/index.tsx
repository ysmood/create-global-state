import {
  useList,
  useTodo,
  delTodo,
  toggleTodo,
  updateTodo,
  addTodo,
  clearCompleted,
  filters,
  setFilter,
  toggleAll,
  useLeftCount,
  useToggleAll,
} from "./store";

export default function TodoApp() {
  return (
    <div>
      <h3>Todo App ({useLeftCount()} todos left)</h3>
      <div className="flex gap-1">
        <ToggleAll />
        <Filter />
        <button onClick={addTodo} title="Add new todo">
          +
        </button>
        <button onClick={clearCompleted} title="Delete all completed todos">
          ✂️
        </button>
      </div>

      <TodoList />
    </div>
  );
}

// ToggleAll component to toggle all todos.
function ToggleAll() {
  return (
    <input
      type="checkbox"
      checked={useToggleAll()}
      onChange={toggleAll}
      disabled={useList().length === 0}
    />
  );
}

// Filter component to filter the todos.
function Filter() {
  return (
    <select onChange={(e) => setFilter(e.target.value)}>
      {filters.map((f) => (
        <option key={f}>{f}</option>
      ))}
    </select>
  );
}

function TodoList() {
  return (
    <>
      {useList().map((id) => {
        return <TodoItem key={id} id={id} />;
      })}
    </>
  );
}

// Todo item component to display a todo.
function TodoItem({ id }: { id: number }) {
  const { done, text } = useTodo(id);

  return (
    <div className="flex gap-1 my-1">
      <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />

      <input
        placeholder="Input text here"
        value={text}
        onChange={(e) => updateTodo(id, e.target.value)}
        disabled={done}
        autoFocus
      />

      <button onClick={() => delTodo(id)} title="Delete current todo">
        ✕
      </button>
    </div>
  );
}
