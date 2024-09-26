import { SetStateAction } from "react";
import createState, { applyAction } from ".";
import { wrap } from "./immer";

/**
 * A hook to create a global state that is persisted in the localStorage, it uses immer for state mutation.
 * If you want low-level customization, use `createLocalStorage` instead.
 * @param key The key to use in the localStorage.
 * @param val The initial value of the state.
 * @returns A hook to use the value, and a function to update it.
 */
export default function create<T>(key: string, val: T) {
  return wrap(createStorage(new LocalStorage<T>(key), val));
}

interface Storage<T> {
  get(): T | undefined;
  set(val: T): void;
}

/**
 * A function to create a global state that is persisted with the provided storage.
 * @param storage The storage to use.
 * @param val The initial value of the state.
 */
export function createStorage<T>(storage: Storage<T>, val: T) {
  const item = storage.get();
  if (item !== undefined) {
    val = item;
  }

  const [useStore, setStore] = createState(val);

  const setLocalStorage = (act: SetStateAction<T>) => {
    val = applyAction(act, val);
    storage.set(val);
    setStore(val);
  };

  return [useStore, setLocalStorage] as const;
}

export class LocalStorage<T> implements Storage<T> {
  constructor(private key: string) {}

  get() {
    const item = localStorage.getItem(this.key);
    console.log(this.key, item);
    return item === null ? undefined : (JSON.parse(item) as T);
  }

  set(val: T) {
    localStorage.setItem(this.key, JSON.stringify(val));
  }
}
