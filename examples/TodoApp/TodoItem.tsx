import { delTodo, toggleTodo, updateTodo, useTodo } from "./todos";

// The component to display a todo.
export default function TodoItem({ id }: { id: number }) {
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
