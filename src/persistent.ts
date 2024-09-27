import createState from ".";
import { type Producer } from "./immer";
import { produce } from "immer";

export const defaultKey = "global-state";

/**
 * A hook to create a global state that is persisted in the url hash, it uses immer for state mutation.
 * @param key The key to use in the url hash.
 * @param val The initial value of the state.
 * @returns A hook to use the value, and a function to update it.
 */
export default function createURLStorage<T>(val: T, key = defaultKey) {
  const storage = new URLStorage<T>(key);

  const item = storage.get();
  if (item !== undefined) {
    val = item;
  }

  storage.set(val);

  const [useStore, setStoreBase] = createState(val);

  const setStore = (producer: Producer<T>, saveHistory: boolean = false) => {
    setStoreBase((val) => {
      val = produce(val, producer);
      storage.set(val, saveHistory);

      return val;
    });
  };

  const listener = () => {
    setStoreBase(() => storage.get()!);
  };
  window.addEventListener("popstate", listener);
  const close = () => {
    window.removeEventListener("popstate", listener);
  };

  return [useStore, setStore, close] as const;
}

/**
 * A function to create a global state that is persisted with the provided storage.
 * @param storage The storage to use.
 * @param val The initial value of the state.
 */
export function createLocalStorage<T>(val: T, key = defaultKey) {
  const storage = new LocalStorage<T>(key);
  const item = storage.get();
  if (item !== undefined) {
    val = item;
  }

  const [useStore, setStoreBase] = createState(val);

  const setStore = (producer: Producer<T>) => {
    val = produce(val, producer);
    storage.set(val);
    setStoreBase(val);
  };

  return [useStore, setStore] as const;
}

class LocalStorage<T> {
  constructor(private key: string) {}

  get() {
    const item = localStorage.getItem(this.key);
    return item === null ? undefined : (JSON.parse(item) as T);
  }

  set(val: T) {
    localStorage.setItem(this.key, JSON.stringify(val));
  }
}

class URLStorage<T> {
  constructor(private key: string) {}

  get() {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const item = params.get(this.key);
    return item === null ? undefined : (JSON.parse(item) as T);
  }

  set(val: T, saveHistory: boolean = false) {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    params.set(this.key, JSON.stringify(val));

    const u = "#" + params.toString();

    if (saveHistory) {
      history.pushState(null, "", u);
    } else {
      history.replaceState(null, "", u);
    }
  }
}
