import { toggleAll, useToggleAll } from "./todos/actions";
import { useZeroCount } from "./todos";

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
