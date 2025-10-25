'use client';

import { CounterProvider, useGetCounterStore } from "./state";
import { UiCounterActions, UiCounterCard, UiCounterCount, UiCounterIsZeroLabel } from "../ui";


export function Counter_Zustand() {
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
  const useCounterState = useGetCounterStore();
  const count = useCounterState(store => store.state.raw.count);
  return <UiCounterCount count={count} />;
}
function CounterIsZero() {
  const useCounterState = useGetCounterStore();
  const isZero = useCounterState(store => store.state.derived.isZero);
  return <UiCounterIsZeroLabel isZero={isZero} />;
}

function CounterActions() {
  const useCounterState = useGetCounterStore();
  const actions = useCounterState(store => store.actions);
  return (
    <UiCounterActions
      onIncrement={actions.increment}
      onDecrement={actions.decrement}
    />
  );
}
