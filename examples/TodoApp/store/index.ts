import { create } from "create-global-state/lib/immer";
import { Filter, initFilter } from "./filter/types";
import { initTodo } from "./todos/types";
import { compose } from "create-global-state/lib/utils";
import logger from "./logger";

export const initStore = {
  todos: [initTodo],
  filter: initFilter as Filter,
};

export type Store = typeof initStore;

export const [useStore, baseSetStore] = create(initStore);

export const setStore = compose(baseSetStore, logger);
