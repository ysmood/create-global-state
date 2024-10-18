import create from "stalo";

const [useCount, setCount] = create(0);

export default function Counter() {
  return (
    <>
      <h3>Basic counter example</h3>
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
