import Filter from "./Filter";
import { addTodo, clearCompleted } from "./todos/actions";
import { useZeroDone } from "./todos";
import ToggleAll from "./ToggleAll";

export default function Actions() {
  return (
    <div className="flex gap-1">
      <ToggleAll />
      <Filter />
      <AddTodo />
      <ClearCompleted />
    </div>
  );
}

function AddTodo() {
  return (
    <button onClick={addTodo} title="Add new todo">
      +
    </button>
  );
}

function ClearCompleted() {
  return (
    <button
      onClick={clearCompleted}
      disabled={useZeroDone()}
      title="Delete all completed todos"
    >
      ✂️
    </button>
  );
}
