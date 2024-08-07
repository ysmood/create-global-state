import { SetStateAction, useSyncExternalStore } from "react";

type Init<T> = T | (() => T);
type Listener = () => void;
type Subscribe = (listener: Listener) => () => void;

/**
 * A hook to create a global state that can be used across components.
 * @param init The initial value of the state. It can be a value or a function that returns a value.
 * @returns A stateful value, and a function to update it.
 */
export default function createGlobalState<T>(init: Init<T>) {
  let listeners: Listener[] = [];
  let val = typeof init === "function" ? (init as () => T)() : init;

  function getSnapshot() {
    return val;
  }

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
  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

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

function getValue<T>(set: SetStateAction<T>, val: T) {
  return typeof set === "function" ? (set as (v: T) => T)(val) : set;
}
