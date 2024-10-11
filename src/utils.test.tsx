import { it, expect } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render, screen } from "@testing-library/react";
import create from ".";
import { useEqual } from "./utils";

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
