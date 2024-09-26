import { SetStateAction, useSyncExternalStore } from "react";

type Listener = () => void;
type Subscribe = (listener: Listener) => () => void;
type Selector<T, P> = (val: T, serverSide: boolean) => P;

type UseStore<T> = {
  // Return the whole state
  (): T;
  // Return a specific part of the state by using a selector
  <P>(selector: Selector<T, P>): P;
};

/**
 * A hook to create a global state that can be used across components.
 * @param val The initial value of the state.
 * @returns A hook to use the value, and a function to update it. The hook can also take a selector to get a specific part of the state.
 */
export default function create<T>(val: T) {
  const listeners = new Set<Listener>();

  const subscribe: Subscribe = function (listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // This is the hook that will be used in components to get the state.
  const useStore: UseStore<T> = function <P>(selector?: Selector<T, P>) {
    return useSyncExternalStore<T | P>(
      subscribe,
      selector === undefined ? () => val : () => selector(val, false),
      selector === undefined ? () => val : () => selector(val, true)
    );
  };

  // This is the function that will be used in components to update the state.
  // It's similar to the useState setter function.
  function setStore(act: SetStateAction<T>) {
    // update val with the new value
    val = applyAction(act, val);

    // notify all listeners
    for (const listener of listeners) {
      listener();
    }
  }

  return [useStore, setStore] as const;
}

export function applyAction<T>(set: SetStateAction<T>, val: T) {
  return set instanceof Function ? set(val) : set;
}
