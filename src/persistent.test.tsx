import { it, expect, describe, beforeEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import createPersistentStorage, {
  createLocalStorage,
  defaultKey,
} from "./persistent";

describe("URLStorage", () => {
  beforeEach(() => {
    location.href = "/";
    location.replace("#");
  });

  it("basic", ({ onTestFinished }) => {
    const [useVal, setVal, close] = createPersistentStorage("01");
    onTestFinished(close);

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

  it("use hash value as init value", ({ onTestFinished }) => {
    location.hash = `${defaultKey}="03"`;

    const [useVal, , close] = createPersistentStorage("01");
    onTestFinished(close);

    function A() {
      return <>{useVal()}</>;
    }

    render(<A />);

    expect(screen.getByText("03")).not.toBeNull();
  });

  it("history should work", async ({ onTestFinished }) => {
    const [useVal, setVal, close] = createPersistentStorage("01");
    onTestFinished(close);

    function A() {
      return <div>{useVal()}</div>;
    }

    setVal(() => "02", true);

    render(<A />);

    expect(screen.getByText("02")).not.toBeNull();

    cleanup();

    const hash = location.hash;

    history.back();

    await vi.waitUntil(() => location.hash != hash);

    render(<A />);

    expect(screen.getByText("01")).not.toBeNull();
  });
});

describe("localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("basic", () => {
    const [useVal, setVal] = createLocalStorage("01");

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
    localStorage.setItem("key", JSON.stringify("03"));

    const [useVal] = createLocalStorage("01", "key");

    function A() {
      return <>{useVal()}</>;
    }

    render(<A />);

    expect(screen.getByText("03")).not.toBeNull();
  });
});
