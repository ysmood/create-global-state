import { useSyncExternalStore } from "react";

/**
 * A function to select a part of the state to return.
 */
export type Selector<S, R> = (state: S, serverSide: boolean) => R;

/**
 * A React hook to use the state.
 */
export type UseStore<S> = {
  /**
   * @returns The current state.
   */
  (): S;

  /**
   * @returns The selected part of the state.
   */
  <R>(selector: Selector<S, R>): R;
};

/**
 * A function to produce the next state based on the previous state.
 */
export type Produce<S> = (previous: S) => S | void;

/**
 * A state or a function to get next state.
 */
export type NextState<S> = S | Produce<S>;

/**
 * A function to update the state. It can be used outside the React components.
 */
export type SetStore<S> = (nextState: NextState<S>, options?: object) => void;

/**
 * Creates a global store for cross-component state management.
 * @param init The initial value of the state.
 */
export default function create<S>(init: S) {
  type Listener = () => void;
  let state = init;

  const listeners = new Set<Listener>();

  const subscribe = function (listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const useStore: UseStore<S> = <P>(
    selector: Selector<S, P> = (val: S) => val as unknown as P
  ) => {
    const get = (serverSide: boolean) => () => selector(state, serverSide);
    return useSyncExternalStore<S | P>(subscribe, get(false), get(true));
  };

  const setStore: SetStore<S> = (ns: NextState<S>) => {
    // update val with the new value
    state = producer(ns)(state) as S;

    // notify all listeners
    for (const listener of listeners) {
      listener();
    }
  };

  return [useStore, setStore] as const;
}

/**
 * Converts a NextState to a Produce function.
 * @returns
 */
export function producer<S>(ns: NextState<S>): Produce<S> {
  return ns instanceof Function ? ns : () => ns;
}
