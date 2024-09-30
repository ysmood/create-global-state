import { lazy, Suspense } from "react";
import { Route } from "wouter";

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
