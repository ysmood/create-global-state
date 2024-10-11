import { useTodoIds } from "./store/todos";
import TodoItem from "./TodoItem";

// The component to display all filtered todos.
export default function Todos() {
  return (
    <>
      {useTodoIds().map((id) => {
        return <TodoItem key={id} id={id} />;
      })}
    </>
  );
}
