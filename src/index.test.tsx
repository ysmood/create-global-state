import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { cleanup, render, screen } from "@testing-library/react";
import createGlobalState from "./index";
import createLocalStorage from "./local-storage";

it("createGlobalState", async () => {
  const [useVal, setVal] = createGlobalState(false);

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

  await userEvent.click(screen.getByText("Click"));

  expect(screen.getByText("OK")).not.toBeNull();
});

it("selector", async () => {
  const [useVal, setVal] = createGlobalState({ val: false });

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

it("createLocalStorageState", async () => {
  localStorage.setItem("key", JSON.stringify("01"));

  const [useVal, setVal] = createLocalStorage("key", "02");

  function A() {
    return <div>{useVal()}</div>;
  }

  render(
    <>
      <A />
    </>
  );

  expect(screen.getByText("01")).not.toBeNull();

  cleanup();

  setVal(() => "03");

  render(
    <>
      <A />
    </>
  );

  expect(screen.getByText("03")).not.toBeNull();
});
