import { it, expect, describe } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { cleanup, render, screen } from "@testing-library/react";
import create from "./index";
import createStorage from "./persistent";
import createImmer from "./immer";
import { renderToString } from "react-dom/server";

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

describe("localStorage", () => {
  it("basic", () => {
    const [useVal, setVal] = createStorage("key", "01");

    function A() {
      return <div>{useVal()}</div>;
    }

    render(<A />);

    expect(screen.getByText("01")).not.toBeNull();

    cleanup();

    setVal(() => "02");

    render(<A />);

    expect(screen.getByText("02")).not.toBeNull();
  });

  it("use storage value as init value", () => {
    localStorage.setItem("key", JSON.stringify("02"));

    const [useVal] = createStorage("key", "01");

    function A() {
      return <>{useVal()}</>;
    }

    render(<A />);

    expect(screen.getByText("02")).not.toBeNull();
  });
});

it("server component", async () => {
  const [useVal] = create(1);

  function A() {
    return <>{useVal()}</>;
  }

  const html = renderToString(<A />);

  expect(html).toContain("1");
});
