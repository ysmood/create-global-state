import { useRef } from "react";
import { SetStore, type Selector } from ".";

export type Equal<R> = (a: R, b: R) => boolean;

/**
 *
 * @param selector Same as the selector in useStore.
 * @param equal If equal returns true, the previous selected value will be returned,
 * else the current selected value will be returned.
 * @returns
 */
export function useEqual<S, R>(
  selector: Selector<S, R>,
  equal: Equal<R>
): Selector<S, R> {
  const prev = useRef<R>();

  return (val, serverSide) => {
    const selected = selector(val, serverSide);
    return (prev.current =
      prev.current !== undefined && equal(prev.current, selected)
        ? prev.current
        : selected);
  };
}

/**
 * A middleware to update the state with options.
 */
export type Middleware<S> = (set: SetStore<S>) => SetStore<S>;

/**
 * Composes multiple middlewares.
 */
export function compose<S>(
  setStore: SetStore<S>,
  ...middlewares: Middleware<S>[]
) {
  return middlewares.reduceRight((s, middleware) => middleware(s), setStore);
}
