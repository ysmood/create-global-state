import { SetStateAction } from "react";
import createState from ".";
import { Init, getValue } from "./utils";
import { wrap } from "./immer";

/**
 * A hook to create a global state that is persisted in the localStorage.
 * @param key The key to use in the localStorage.
 * @param init The initial value of the state. It can be a value or a function that returns a value.
 * @returns A hook to use the value, and a function to update it.
 */
export default function create<T>(key: string, init: Init<T>) {
  return wrap(createLocalStorage(key, init));
}

export function createLocalStorage<T>(key: string, init: Init<T>) {
  let val = typeof init === "function" ? (init as () => T)() : init;

  const item = localStorage.getItem(key);
  if (item !== null) {
    val = JSON.parse(item);
  }

  const [useStore, setStore] = createState(val);

  const setLocalStorage = (act: SetStateAction<T>) => {
    val = getValue(act, val);
    localStorage.setItem(key, JSON.stringify(val));
    setStore(val);
  };

  return [useStore, setLocalStorage] as const;
}
