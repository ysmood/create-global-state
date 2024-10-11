import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import createImmer from "./immer";

it("immer", async () => {
  const [useVal, setVal] = createImmer(false);

  function A() {
    return <button onClick={() => setVal(() => true)}>Click</button>;
  }

  function B() {
    const val = useVal();
    return <div>{val ? "OK" : ""}</div>;
  }

  render(
    <>
      <A />
      <B />
    </>
  );

  expect(screen.queryByText("OK")).toBeNull();
  await userEvent.click(screen.getByText("Click"));
  expect(screen.getByText("OK")).not.toBeNull();
});

it("immer replace", async () => {
  const [useVal, setVal] = createImmer(false);

  function A() {
    return <button onClick={() => setVal(true)}>Click</button>;
  }

  function B() {
    const val = useVal();
    return <div>{val ? "OK" : ""}</div>;
  }

  render(
    <>
      <A />
      <B />
    </>
  );

  expect(screen.queryByText("OK")).toBeNull();
  await userEvent.click(screen.getByText("Click"));
  expect(screen.getByText("OK")).not.toBeNull();
});
