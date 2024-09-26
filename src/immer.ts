import createState from ".";
import { produce } from "immer";

/**
 * It's similar to the base createGlobalState function, but it uses Immer to update the state immutably.
 */
export default function create<T>(init: T) {
  return wrap(createState(init));
}

/**
 * Wrap the useStore and setStore functions to use Immer for immutability.
 */
export function wrap<T>([useStore, setStore]: ReturnType<
  typeof createState<T>
>) {
  return [
    useStore,
    (recipe: (draft: T) => void) => setStore((val) => produce(val, recipe)),
  ] as const;
}
