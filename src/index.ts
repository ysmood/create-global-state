import { SetStateAction, useRef, useSyncExternalStore } from "react";

type Listener = () => void;
type Subscribe = (listener: Listener) => () => void;

type Equal<P> = (a: P, b: P) => boolean;
type Selector<T, P> = (val: T, serverSide: boolean) => P;
type UseStore<T> = {
  (): T;
  <P>(selector: Selector<T, P>): P;
};

/**
 * A hook to create a global state that can be used across components.
 * @param val The initial value of the state.
 * @returns A hook useStore to get the state, and a function setStore to update the state.
 * The hook can also take a selector to get a specific part of the state.
 */
export default function create<T>(val: T) {
  const listeners = new Set<Listener>();

  const subscribe: Subscribe = function (listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  /**
   * A hook to get a part of the state.
   * @param selector The function to select a part of the state as the return value.
   * By default it returns the whole state.
   * @returns The selected part of the state.
   */
  const useStore: UseStore<T> = <P>(
    selector: Selector<T, P> = (val: T) => val as unknown as P
  ) => {
    const get = (serverSide: boolean) => () => selector(val, serverSide);
    return useSyncExternalStore<T | P>(subscribe, get(false), get(true));
  };

  // This is the function that will be used in components to update the state.
  // It's similar to the useState setter function.
  function setStore(act: SetStateAction<T>) {
    // update val with the new value
    val = act instanceof Function ? act(val) : act;

    // notify all listeners
    for (const listener of listeners) {
      listener();
    }
  }

  return [useStore, setStore] as const;
}

/**
 *
 * @param selector Same as the selector in useStore.
 * @param equal If equal returns true, the previous selected value will be returned,
 * else the current selected value will be returned.
 * @returns
 */
export function useEqual<T, P>(
  selector: Selector<T, P>,
  equal: Equal<P>
): Selector<T, P> {
  const prev = useRef<P>();

  return (val, serverSide) => {
    const selected = selector(val, serverSide);
    return (prev.current =
      prev.current !== undefined && equal(prev.current, selected)
        ? prev.current
        : selected);
  };
}
