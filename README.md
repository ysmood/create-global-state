# Overview

An elegant state management solution for React.

## Features

- **Non-opinionated**: Like useState, only one core function, others are built on top of it.
- **Type safe**: The state is type safe and the return value is intuitive.
- **Global**: The state is global, you can access it anywhere.
- **Scalable**: Naturally scale large state into multiple modules and files without performance degradation.
- **Tiny**: Less than [0.3KB](https://bundlephobia.com/package/create-global-state).

## Documentation

### Get started

```bash
npm install create-global-state
```

```tsx
import create from "create-global-state";

const [useCount, setCount] = create(0);

const inc = () => setCount((c) => c + 1);

export default function App() {
  return <button onClick={inc}>Count {useCount()}</button>;
}
```

### Examples

Check the [Counter](./examples/Counter.tsx) for basic usage, or try it [online](https://codesandbox.io/p/sandbox/jtfywj).

Check the [CounterPersistent](./examples/CounterPersistent.tsx), [MonolithStore](./examples/MonolithStore), [TodoApp](./examples/TodoApp) for more advanced usage.

## FAQ

> Why not use [react-use's createGlobalState](https://github.com/streamich/react-use/blob/master/docs/createGlobalState.md)?

Its implementation is not type safe and the return value is not intuitive. It's too late to make a PR to change its interface.

> Why not [zustand](https://github.com/pmndrs/zustand)?

The typescript support is not good enough, the API is not intuitive. `create-global-state` is more like `useState` which aligns with the react API style. Check the [comparison](https://github.com/ysmood/create-global-state/issues/1). Zustand [Slices Pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) can cause naming conflict issues.
`create-global-state` can naturally scale states by modules and files.
