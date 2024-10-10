import "./index.css";
import ReactDOM from "react-dom/client";
import { Link, Switch, Router, Route } from "wouter";
import { lazy, StrictMode, Suspense } from "react";

const examples = ["Counter", "CounterPersistent", "MonolithStore", "TodoApp"];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {examples.map((name) => {
      return (
        <Link href={`/examples/${name}`} key={name} className={"mx-1"}>
          {name}
        </Link>
      );
    })}

    <Switch>
      <ExampleRoute path="/" name={examples[0]} />
      <Router base="/examples">
        {examples.map((n) => (
          <ExampleRoute key={n} name={n} />
        ))}
      </Router>
    </Switch>
  </StrictMode>
);

export function ExampleRoute({ name, path }: { name: string; path?: string }) {
  path = path || `/${name}`;
  const Example = lazy(() => import(/* @vite-ignore */ `./${name}`));
  return (
    <Route path={path}>
      <Suspense fallback={<div>Loading...</div>}>
        <Example />
      </Suspense>
    </Route>
  );
}
