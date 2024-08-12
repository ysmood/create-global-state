import React from "react";
import ReactDOM from "react-dom/client";
import Counter from "./Counter.tsx";
import CounterLocalStorage from "./CounterLocalStorage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Counter />
    <hr />
    <CounterLocalStorage />
  </React.StrictMode>
);
