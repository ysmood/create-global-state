import createGlobalState from "create-global-state";

const [useCount, setCount] = createGlobalState(0);

export default function Counter() {
  return (
    <>
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
