import createState from ".";
import { produce } from "immer";

export type Producer<T> = (draft: T) => T | void;

/**
 * It's similar to the base createGlobalState function, but it uses Immer to update the state immutably.
 */
export default function create<T>(init: T) {
  const [useStore, setStore] = createState(init);
  return [
    useStore,
    (producer: Producer<T>) => setStore((val) => produce(val, producer)),
  ] as const;
}
