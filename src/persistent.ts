import create, { producer } from ".";
import { compose, SetStoreX } from "./utils";
import immer from "./immer";

export const defaultKey = "global-state";

export default function createPersistentStorage<T>(init: T, key = defaultKey) {
  const storage = new URLStorage(key, init);
  const [useStore, setStore] = create(storage.get());
  const setByStorage = () => setStore(storage.get());
  return [
    useStore,
    compose(setStore, immer, urlStorage(storage)),
    setByStorage,
  ] as const;
}

export function createLocalStorage<T>(init: T, key = defaultKey) {
  const storage = new LocalStorage(key, init);
  const [useStore, setStore] = create(storage.get());
  return [useStore, compose(setStore, immer, localStorage(storage))] as const;
}

export const saveHistory = Symbol("saveHistory");

export type URLStorageOptions = { [saveHistory]?: boolean };

export function urlStorage<S>(storage: URLStorage<S>) {
  return function (set: SetStoreX<S>): SetStoreX<S> {
    return (ns, opts?: URLStorageOptions) => {
      const produce = producer(ns);
      set((state) => {
        const s = produce(state) as S;
        storage.set(s, opts?.[saveHistory]);
        return s;
      }, opts);
    };
  };
}

export function localStorage<S>(storage: LocalStorage<S>) {
  return function (set: SetStoreX<S>): SetStoreX<S> {
    return (ns, opts) => {
      const produce = producer(ns);
      set((state) => {
        storage.set(state);
        return produce(state);
      }, opts);
    };
  };
}

export class LocalStorage<S> {
  constructor(private key: string, private init: S) {}

  get() {
    const item = window.localStorage.getItem(this.key);
    return item === null ? this.init : (JSON.parse(item) as S);
  }

  set(val: S) {
    window.localStorage.setItem(this.key, JSON.stringify(val));
  }
}

export class URLStorage<S> {
  constructor(private key: string, private init: S) {}

  get() {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const item = params.get(this.key);
    return item === null ? this.init : (JSON.parse(item) as S);
  }

  set(val: S, saveHistory?: boolean) {
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
