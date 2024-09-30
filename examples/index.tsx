import "./index.css";
import ReactDOM from "react-dom/client";
import { Link, Switch, Router } from "wouter";
import { ExampleRoute } from "./utils";

const examples = ["Counter", "CounterPersistent", "MonolithStore", "TodoApp"];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
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
  </>
);
