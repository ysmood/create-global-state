import { createLocalStorage } from "create-global-state";

const [useCount, setCount] = createLocalStorage("counter", 0);

export default function CounterLocalStorage() {
  return (
    <>
      <h3> The count will persist after you refresh the page:</h3>
      <Button />
      <Display />
    </>
  );
}

function Button() {
  return <button onClick={() => setCount((c) => c + 1)}>Increase</button>;
}

function Display() {
  const count = useCount();
  return <h1>{count}</h1>;
}
