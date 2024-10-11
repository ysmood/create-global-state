import { setStore, useStore } from "..";
import { Filter } from "./types";

export const useFilter = () => {
  return useStore((state) => state.filter);
};

export const setFilter = (filter: string) => {
  setStore((s) => {
    s.filter = filter as Filter;
  });
};
