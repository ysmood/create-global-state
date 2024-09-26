import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import create from ".";

it("create", async () => {
  const [useVal, setVal] = create(false);

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

it("multiple listeners", async () => {
  const [useVal, setVal] = create(false);

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
      <B />
    </>
  );

  expect(screen.queryByText("OK")).toBeNull();
  await userEvent.click(screen.getByText("Click"));
  expect(screen.getAllByText("OK")).length(2);
});

it("selector", async () => {
  const [useVal, setVal] = create({ val: false });

  function A() {
    return <button onClick={() => setVal({ val: true })}>Click</button>;
  }

  function B() {
    const val = useVal((s) => s.val);
    return <div>{val ? "OK" : ""}</div>;
  }

  render(
    <>
      <A />
      <B />
    </>
  );

  await userEvent.click(screen.getByText("Click"));

  expect(screen.getByText("OK")).not.toBeNull();
});
