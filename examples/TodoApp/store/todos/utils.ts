// Compare two arrays' equality.
export function numbersEqual<T>(x: T[], y: T[]) {
  return x.length === y.length && x.every((v, i) => v === y[i]);
}
