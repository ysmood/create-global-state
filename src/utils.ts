import { SetStateAction } from "react";

export type Init<T> = T | (() => T);

export function getValue<T>(set: SetStateAction<T>, val: T) {
  return typeof set === "function" ? (set as (v: T) => T)(val) : set;
}
