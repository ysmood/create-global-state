import createState, { producer, NextState } from ".";
import { produce } from "immer";
import { compose, SetStoreX } from "./utils";

/**
 * It's similar to the base create function, but it uses Immer to update the state immutably.
 */
export function create<S>(init: S) {
  const [useStore, setStore] = createState(init);
  return [useStore, compose(setStore, immer)] as const;
}

export default function immer<S>(set: SetStoreX<S>) {
  return (ns: NextState<S>, opts?: object) =>
    set((s) => produce(s, producer(ns)), opts);
}
