import create, { saveHistory } from "create-global-state/lib/persistent";
import { useEffect } from "react";
import { useHashLocation } from "wouter/use-hash-location";

const [useCount, setCount, setCountByStorage] = create(0);

export default function CounterPersistent() {
  // Update the count when the location changes.
  const [location] = useHashLocation();
  useEffect(setCountByStorage, [location]);

  return (
    <>
      <h3>
        The count is stored in the url, it will persist after you refresh the
        page, you can use the back and forward buttons to navigate the history:
      </h3>
      <Button />
      <Display />
    </>
  );
}

function Button() {
  return (
    <button onClick={() => setCount((c) => c + 1, { [saveHistory]: true })}>
      Increase
    </button>
  );
}

function Display() {
  const count = useCount();
  return <h1>{count}</h1>;
}
