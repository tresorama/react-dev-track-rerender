'use client';

import { CounterProvider, useCounterActions, useCounterState } from "./state";
import { UiCounterActions, UiCounterCard, UiCounterCount } from "../ui";


export function Counter_RC() {
  return (
    <CounterProvider>
      <TheCounter />
    </CounterProvider>
  );
}


function TheCounter() {
  return (
    <UiCounterCard>
      <CounterCount />
      <CounterActions />
    </UiCounterCard>
  );
}
function CounterCount() {
  const count = useCounterState().raw.count;
  return <UiCounterCount count={count} />;
}

function CounterActions() {
  const actions = useCounterActions();
  return (
    <UiCounterActions
      onIncrement={actions.increment}
      onDecrement={actions.decrement}
    />
  );
}
