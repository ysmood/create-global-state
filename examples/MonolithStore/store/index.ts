// Here we use Immer to update the store immutably, Immer is optional,
// you can use vanilla js or other libs to update the store.
import create from "create-global-state/immer";

// Define the monolith store for the entire web app.
// It contains a list of counters and a title string.
const [useStore, setStore] = create({
  title: "Monolith Store",
  counters: [
    {
      name: "Counter X",
      count: 1,
    },
    {
      name: "Counter Y",
      count: 2,
    },
  ],
});

export { useStore, setStore };

export function useTitle() {
  return useStore((s) => s.title);
}
