import { SetStateAction, useSyncExternalStore } from "react";
import { getValue, Init } from "./utils";

type Listener = () => void;
type Subscribe = (listener: Listener) => () => void;
type Selector<T, P> = (val: T) => P;

type UseStore<T> = {
  // Return the whole state
  (): T;
  // Return a specific part of the state by using a selector
  <P>(selector: Selector<T, P>): P;
};

/**
 * A hook to create a global state that can be used across components.
 * @param init The initial value of the state. It can be a value or a function that returns a value.
 * @returns A hook to use the value, and a function to update it. The hook can also take a selector to get a specific part of the state.
 */
export default function create<T>(init: Init<T>) {
  let listeners: Listener[] = [];
  let val = typeof init === "function" ? (init as () => T)() : init;

  function emitChange() {
    for (const listener of listeners) {
      listener();
    }
  }

  const subscribe: Subscribe = function (listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  // This is the hook that will be used in components to get the state.
  const useStore: UseStore<T> = function <P>(selector?: Selector<T, P>) {
    function getSnapshot() {
      if (selector === undefined) {
        return val;
      }

      return selector(val);
    }

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  };

  // This is the function that will be used in components to update the state.
  // It's similar to the useState setter function.
  function setStore(act: SetStateAction<T>) {
    // update val with the new value
    val = getValue(act, val);

    // notify all listeners
    emitChange();
  }

  return [useStore, setStore] as const;
}
