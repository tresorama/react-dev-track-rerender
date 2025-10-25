'use client';

import { createReactContextStore } from '@/lib/state/react-context/create-react-context-store';


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

// ctx

export const {
  Provider: CounterProvider,
  useStoreState: useCounterState,
  useStoreActions: useCounterActions,
} = createReactContextStore<CounterState, CounterActions>(
  () => initialState,
  (setState) => {

    function calculateNewState(oldState: CounterState, newStateRaw: CounterState['raw']) {
      const newState: CounterState = {
        raw: newStateRaw,
        derived: deriveCounterState(oldState, newStateRaw),
      };
      return newState;
    }

    return {
      increment: () => {
        setState(oldState => {
          const newStateRaw: CounterState['raw'] = {
            count: oldState.raw.count + 1,
          };
          return calculateNewState(oldState, newStateRaw);
        });
      },
      decrement: () => {
        setState(oldState => {
          const newStateRaw: CounterState['raw'] = {
            count: oldState.raw.count - 1,
          };
          return calculateNewState(oldState, newStateRaw);
        });
      },
      reset: () => {
        setState(oldState => {
          const newStateRaw: CounterState['raw'] = {
            count: 0,
          };
          return calculateNewState(oldState, newStateRaw);
        });
      },
    };
  }
);
