import { producer, SetStore } from "stalo";

// Create a custom middleware to log all the state changes.
export default function logger<S>(set: SetStore<S>): SetStore<S> {
  return (ns, opts) => {
    set((from) => {
      const to = producer(ns)(from);

      console.info("Change state", { from, to });

      return to;
    }, opts);
  };
}
