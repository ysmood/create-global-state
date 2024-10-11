import { toggleAll, useToggleAll } from "./store/actions";
import { useZeroCount } from "./store/todos";

// The component to toggle all todos.
export default function ToggleAll() {
  return (
    <input
      type="checkbox"
      checked={useToggleAll()}
      onChange={toggleAll}
      disabled={useZeroCount()}
    />
  );
}
