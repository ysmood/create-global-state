import createState from ".";
import { produce as baseProduce } from "immer";

/**
 * The producer is used to update the state immutably.
 * If it's a function, it will be called with the current draft state.
 * If it's a value, the state will be replaced with the value.
 * @param draft The current draft state you will make changes on.
 * @returns If you return a new state, the state will be updated with the new state.
 * If you return nothing, the draft will be used to update the state.
 */
export type Producer<T> = T | ((draft: T) => T | void);

/**
 * It's similar to the base create function, but it uses Immer to update the state immutably.
 */
export default function create<T>(init: T) {
  const [useStore, setStore] = createState(init);
  return [
    useStore,
    (producer: Producer<T>) => setStore((state) => produce(state, producer)),
  ] as const;
}

export function produce<T>(state: T, producer: Producer<T>) {
  return producer instanceof Function ? baseProduce(state, producer) : producer;
}
