import { it, expect, describe } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import create, { useEqual } from ".";
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

describe("server component", async () => {
  it("basic", () => {
    const [useVal] = create(1);

    function A() {
      return <>{useVal()}</>;
    }

    const html = renderToString(<A />);

    expect(html).toContain("1");
  });

  it("render different value on server", () => {
    const [useVal] = create("client");

    function A() {
      return <>{useVal((v, s) => (s ? "server" : v))}</>;
    }

    const html = renderToString(<A />);
    expect(html).toContain("server");

    render(<A />);
    expect(screen.getByText("client")).not.toBeNull();
  });
});
