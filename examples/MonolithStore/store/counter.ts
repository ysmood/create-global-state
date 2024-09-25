import { setStore, useStore } from ".";

// Define a getter to access a specific counter.
export function useCounter(index: number) {
  return useStore((s) => s.counters[index]);
}

// Define a setter to increase the count of a specific counter.
export function increase(index: number) {
  setStore((s) => {
    s.counters[index].count += 1;
  });
}
