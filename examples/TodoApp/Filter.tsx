import { filters, setFilter } from "./todos/filter";

// The component to filter the todos.
export default function Filter() {
  return (
    <select onChange={(e) => setFilter(e.target.value)}>
      {filters.map((f) => (
        <option key={f}>{f}</option>
      ))}
    </select>
  );
}
