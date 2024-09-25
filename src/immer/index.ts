import create, { Init } from "..";
import { produce } from "immer";

/**
 * It's similar to the base createGlobalState function, but it uses Immer to update the state immutably.
 */
export default function createGlobalState<T>(init: Init<T>) {
  const [useStore, setStore] = create(init);

  function setStoreWithImmer(recipe: (draft: T) => void) {
    setStore((val) => produce(val, recipe));
  }

  return [useStore, setStoreWithImmer] as const;
}
