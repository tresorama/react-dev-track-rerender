'use client';

import { create } from 'zustand';

import { createZustandStore } from '@/lib/state/zustand/create-zustand-store';

// store types

type CounterState = {
  raw: {
    count: number,
  },
  derived: {
    isZero: boolean,
  };
};

type CounterActions = {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// initial state + deriver fn

const initialStateRaw: CounterState['raw'] = {
  count: 0,
};

const initialState: CounterState = {
  raw: {
    count: 0
  },
  derived: deriveCounterState(
    {
      raw: { count: 0 },
      derived: {
        isZero: true,
      }
    },
    initialStateRaw,
  ),
};

function deriveCounterState(oldState: CounterState, newStateRaw: CounterState['raw']): CounterState['derived'] {

  // initialize empty
  let isZero: CounterState['derived']['isZero'] = false;

  // populate
  if (newStateRaw.count === 0) isZero = true;

  return {
    isZero,
  };
}

// store

type CounterStore = {
  state: CounterState,
  actions: CounterActions,
};

function createCounterStore() {
  return create<CounterStore>((setState, getState) => {

    function updateStateAndDerive(newStateRaw: CounterState['raw']) {
      const newState: CounterState = {
        raw: newStateRaw,
        derived: deriveCounterState(getState().state, newStateRaw),
      };
      setState({ state: newState });
    }

    const state: CounterState = initialState;
    const actions: CounterActions = {
      increment: () => {
        const oldState = getState().state;
        const newStateRaw: CounterState['raw'] = {
          count: oldState.raw.count + 1,
        };
        updateStateAndDerive(newStateRaw);
      },
      decrement: () => {
        const oldState = getState().state;
        const newStateRaw: CounterState['raw'] = {
          count: oldState.raw.count - 1,
        };
        updateStateAndDerive(newStateRaw);
      },
      reset: () => {
        const newStateRaw: CounterState['raw'] = {
          count: 0,
        };
        updateStateAndDerive(newStateRaw);
      },
    };

    return {
      state,
      actions,
    };

  });
}

const {
  StoreProvider: CounterProvider,
  useGetStore: useGetCounterStore,
} = createZustandStore(createCounterStore);

export {
  CounterProvider,
  useGetCounterStore
};