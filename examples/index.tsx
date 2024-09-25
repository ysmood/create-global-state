import React from "react";
import ReactDOM from "react-dom/client";
import Counter from "./Counter.tsx";
import CounterLocalStorage from "./CounterLocalStorage.tsx";
import MonolithStore from "./MonolithStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="counter">
      <Counter />
    </div>
    <hr />
    <div className="counter-local-storage">
      <CounterLocalStorage />
    </div>
    <hr />
    <div className="monolith-store">
      <MonolithStore />
    </div>
  </React.StrictMode>
);
