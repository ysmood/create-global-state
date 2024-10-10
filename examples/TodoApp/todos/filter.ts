import create from "create-global-state";

const initFilter = "All";

export const filters = [initFilter, "Active", "Completed"] as const;

export type Filter = (typeof filters)[number];

export const [useFilter, setFilterBase, getFilter] = create<Filter>(initFilter);

export const setFilter = (filter: string) => {
  setFilterBase(filter as Filter);
};
