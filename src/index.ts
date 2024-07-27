import { SetStateAction, useSyncExternalStore } from "react";

type Init<T> = T | (() => T);
type Listener = () => void;
type Subscribe = (listener: Listener) => () => void;

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

  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  return [
    useStore,
    (act: SetStateAction<T>) => {
      const newVal = getValue(act, val);
      if (newVal !== val) {
        val = newVal;
        emitChange();
      }
    },
  ] as const;
}

function getValue<T>(set: SetStateAction<T>, val: T) {
  return typeof set === "function" ? (set as (v: T) => T)(val) : set;
}
