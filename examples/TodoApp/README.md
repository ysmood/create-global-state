# Overview

An example of how to use `stalo` to build a scalable todo app.
The example is intentionally split the app into tiny modules to show how to scale the app.
So that when you update part of the state, only the minimal components will re-render, not the whole todo list or app.

## Compare the rerendering with TodoMVC

We use [react chrome extension](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
to [visualize the rerender](https://github.com/user-attachments/assets/ef42abfc-814b-4eff-b31c-8ca867d87128)
of each implementation.

### stalo

![stalo](https://github.com/user-attachments/assets/dc405ff6-fe6e-40f5-8703-e0a2e1aa7b8e)

### [todomvc.com](https://todomvc.com/examples/react/dist/)

![todomvc](https://github.com/user-attachments/assets/9e175ab1-0a16-4819-a079-c3ffb4238695)
