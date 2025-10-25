import { create } from 'zustand';
import { createZustandStore } from './create-zustand-store.jsx';


// type

type CounterState = {
  count: number;
};

type CounterActions = { increment: () => void; };

type CounterStore = CounterState & CounterActions;


// store creator factory

function createCounterStore() {
  return create<CounterStore>()(set => {
    return {
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
      decrement: () => set(state => ({ count: state.count - 1 }))
    };
  });
}

// common zustand usage

const useStoreGlobal = createCounterStore();

// our wrapper that bind a react context with a zustand store instance

const {
  StoreProvider,
  useGetStore,
} = createZustandStore(createCounterStore);
const useStore = useGetStore();