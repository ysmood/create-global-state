import { useLeftCount } from "./store/todos";

export default function Title() {
  return <h3>Todo App ({useLeftCount()} todos left)</h3>;
}
