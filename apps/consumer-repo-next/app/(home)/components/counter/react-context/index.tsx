'use client';

import { CounterProvider, useCounterActions, useCounterState } from "./state";
import { UiCounterActions, UiCounterCard, UiCounterCount, UiCounterIsZeroLabel } from "../ui";


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
      <CounterIsZero />
      <CounterActions />
    </UiCounterCard>
  );
}
function CounterCount() {
  const count = useCounterState().raw.count;
  return <UiCounterCount count={count} />;
}
function CounterIsZero() {
  const isZero = useCounterState().derived.isZero;
  return <UiCounterIsZeroLabel isZero={isZero} />;
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
