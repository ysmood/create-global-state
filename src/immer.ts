import createState from ".";
import { produce } from "immer";

/**
 * The producer function that is used to update the state immutably.
 * @param draft The current draft state you will make changes on.
 * @returns If you return a new state, the state will be updated with the new state.
 * If you return nothing, the draft will be used to update the state.
 */
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
