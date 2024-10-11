import { producer } from "create-global-state";
import { SetStoreX } from "create-global-state/lib/utils";

// Create a custom middleware to log all the state changes.
export default function logger<S>(next: SetStoreX<S>): SetStoreX<S> {
  return (ns, opts) => {
    next((from) => {
      const to = producer(ns)(from);

      console.info("set state", { from, to });

      return to;
    }, opts);
  };
}
