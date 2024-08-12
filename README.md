# Overview

A simple react lib to create a global state that can be shared between components that don't share common parent.

Check the [counter example](./examples/Counter.tsx) for basic usage, or try it online [here](https://vscode.dev/github.com/ysmood/create-global-state).
Check the [localStorage example](./examples/CounterLocalStorage.tsx) for more advanced usage.

Why not use [react-use's createGlobalState](https://github.com/streamich/react-use/blob/master/docs/createGlobalState.md)? Its implementatiom is not type safe and the return value is not intuitive. It's too late to make a PR to change its interface.
