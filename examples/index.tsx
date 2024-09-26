import React from "react";
import ReactDOM from "react-dom/client";
import Counter from "./Counter.tsx";
import CounterPersistent from "./CounterPersistent.tsx";
import MonolithStore from "./MonolithStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="counter">
      <Counter />
    </div>
    <hr />
    <div className="counter-persistent">
      <CounterPersistent />
    </div>
    <hr />
    <div className="monolith-store">
      <MonolithStore />
    </div>
  </React.StrictMode>
);
