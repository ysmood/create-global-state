import { SetStateAction, useRef, useSyncExternalStore } from "react";

export type Equal<P> = (a: P, b: P) => boolean;

export type Selector<T, P> = (val: T, serverSide: boolean) => P;

/**
 * A hook to use the state.
 */
export type UseStore<T> = {
  /**
   * @returns The current state.
   */
  (): T;

  /**
   * @param selector A function to select a part of the state to return.
   * @returns The selected part of the state.
   */
  <P>(selector: Selector<T, P>): P;
};

/**
 * A hook to create a global state that can be used across components.
 * @param init The initial value of the state.
 * @returns A React hook to use the state, a function to update the state, and a function to get the state.
 * If you want a component to rerender when the state changes, you can use the hook.
 */
export default function create<T>(init: T) {
  type Listener = () => void;
  let state = init;

  const listeners = new Set<Listener>();

  const subscribe = function (listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const useStore: UseStore<T> = <P>(
    selector: Selector<T, P> = (val: T) => val as unknown as P
  ) => {
    const get = (serverSide: boolean) => () => selector(state, serverSide);
    return useSyncExternalStore<T | P>(subscribe, get(false), get(true));
  };

  const setStore = (act: SetStateAction<T>) => {
    // update val with the new value
    state = act instanceof Function ? act(state) : act;

    // notify all listeners
    for (const listener of listeners) {
      listener();
    }
  };

  return [useStore, setStore, () => state] as const;
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
