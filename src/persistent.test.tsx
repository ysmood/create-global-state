import { it, expect, describe, beforeEach, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import createPersistentStorage, {
  createLocalStorage,
  defaultKey,
} from "./persistent";

describe("URLStorage", () => {
  let originalHash: string;

  beforeEach(() => {
    originalHash = location.hash;
  });

  afterEach(() => {
    location.hash = originalHash;
  });

  it("basic", () => {
    const [useVal, setVal, , getVal] = createPersistentStorage("01");

    function A() {
      return <div>{useVal()}</div>;
    }

    render(<A />);

    expect(screen.getByText("01")).not.toBeNull();
    expect(getVal()).toBe("01");

    cleanup();

    setVal(() => "02");

    render(<A />);

    expect(screen.getByText("02")).not.toBeNull();
  });

  it("use hash value as init value", () => {
    location.hash = `${defaultKey}="03"`;

    const [useVal] = createPersistentStorage("01");

    function A() {
      return <>{useVal()}</>;
    }

    render(<A />);

    expect(screen.getByText("03")).not.toBeNull();
  });

  it("history should work", async () => {
    const [useVal, setVal, setByStorage] = createPersistentStorage("01");

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

    setByStorage();

    render(<A />);

    expect(screen.getByText("01")).not.toBeNull();
  });

  it("setByStorage with hash", async () => {
    const [useVal, , setByStorage] = createPersistentStorage("01");

    location.hash = `${defaultKey}="03"`;

    function A() {
      return <div>{useVal()}</div>;
    }

    setByStorage();

    render(<A />);

    expect(screen.getByText("03")).not.toBeNull();
  });
});

describe("localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("basic", () => {
    const [useVal, setVal, getVal] = createLocalStorage("01");

    function A() {
      return <div>{useVal()}</div>;
    }

    render(<A />);

    expect(screen.getByText("01")).not.toBeNull();
    expect(getVal()).toBe("01");

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
