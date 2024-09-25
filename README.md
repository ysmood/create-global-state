# Overview

A elegant state management solution for React. Features:

- **Type safe**: The state is type safe and the return value is intuitive.
- **Global**: The state is global, you can access it anywhere.
- **Performant**: Supports selector to avoid unnecessary re-render.
- **Tiny**: Less than [0.5KB](https://bundlephobia.com/package/create-global-state).

Check the [counter example](./examples/Counter.tsx) for basic usage, or try it [online](https://codesandbox.io/p/sandbox/jtfywj).
Check the [localStorage example](./examples/CounterLocalStorage.tsx) and [monolith store example](./examples/MonolithStore.tsx) for more advanced usage.

Why not use [react-use's createGlobalState](https://github.com/streamich/react-use/blob/master/docs/createGlobalState.md)? Its implementation is not type safe and the return value is not intuitive. It's too late to make a PR to change its interface.
