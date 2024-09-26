import create from "create-global-state/lib/persistent";

const [useCount, setCount] = create(0);

export default function CounterPersistent() {
  return (
    <>
      <h3>
        {" "}
        The count is stored in the url, it will persist after you refresh the
        page, you can use the back and forward buttons to navigate the history:
      </h3>
      <Button />
      <Display />
    </>
  );
}

function Button() {
  return <button onClick={() => setCount((c) => c + 1, true)}>Increase</button>;
}

function Display() {
  const count = useCount();
  return <h1>{count}</h1>;
}
