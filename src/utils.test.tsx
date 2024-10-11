import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import create, { producer, SetStore } from ".";
import { compose, Middleware, useEqual } from "./utils";

it("selector with equal", async () => {
  const [useVal, setVal] = create({ val: "test" });

  let count = 0;

  function A() {
    count++;
    const [{ val }] = useVal(
      useEqual(
        (s) => [s],
        ([a], [b]) => a.val === b.val
      )
    );
    return <button onClick={() => setVal({ val: "test" })}>{val}</button>;
  }

  render(<A />);

  await userEvent.click(screen.getByText("test"));

  expect(count).toBe(1);
});

it("compose", async () => {
  let state = 0;
  const set: SetStore<number> = (ns) => {
    state = producer(ns)(state)!;
  };

  const addOne: Middleware<number> = (set) => (ns) => {
    set((s) => {
      return producer(ns)(s)! + 1;
    });
  };

  const double: Middleware<number> = (set) => (ns) => {
    set((s) => {
      return producer(ns)(s)! * 2;
    });
  };

  compose(set, addOne, double)(2);

  expect(state).toBe(6);
});
