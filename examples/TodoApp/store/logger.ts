import { producer } from "create-global-state";
import { SetStoreX } from "create-global-state/lib/utils";

// Create a custom middleware to log all the state changes.
export default function logger<S>(set: SetStoreX<S>): SetStoreX<S> {
  return (ns, opts) => {
    set((from) => {
      const to = producer(ns)(from);

      console.info("Change state", { from, to });

      return to;
    }, opts);
  };
}
