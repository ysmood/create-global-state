import createState from ".";
import { type Producer } from "./immer";
import { produce } from "immer";

export const defaultKey = "global-state";

/**
 * A hook to create a global state that is persisted in the url hash, it uses immer for state mutation.
 * @param key The key to use in the url hash.
 * @param init The initial value of the state.
 * @returns A hook to use the state, a function to update the state, a function to set the state by current url hash,
 * and a function to get the state.
 */
export default function createURLStorage<T>(init: T, key = defaultKey) {
  const storage = new URLStorage<T>(key);
  const getVal = () => storageGetter(storage, init);
  const [useStore, setStoreBase, getStore] = createState(getVal());

  const setStore = (producer: Producer<T>, saveHistory: boolean = false) => {
    setStoreBase((val) => {
      val = produce(val, producer);
      storage.set(val, saveHistory);

      return val;
    });
  };

  const setByStorage = () => setStoreBase(getVal);

  return [useStore, setStore, setByStorage, getStore] as const;
}

/**
 * A function to create a global state that is persisted with the provided storage.
 * @param storage The storage to use.
 * @param init The initial value of the state.
 * @returns A hook to use the state, a function to update the state, and a function to get the state.
 */
export function createLocalStorage<T>(init: T, key = defaultKey) {
  const storage = new LocalStorage<T>(key);
  const [useStore, setStoreBase, getStore] = createState(
    storageGetter(storage, init)
  );

  const setStore = (producer: Producer<T>) => {
    setStoreBase((val) => {
      val = produce(val, producer);
      storage.set(val);
      return val;
    });
  };

  return [useStore, setStore, getStore] as const;
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

  set(val: T, saveHistory?: boolean) {
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

function storageGetter<T>(storage: { get: () => T | undefined }, init: T) {
  const item = storage.get();
  return item === undefined ? init : item;
}
