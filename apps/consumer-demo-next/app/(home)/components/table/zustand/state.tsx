import { create } from "zustand";
import { createReactStore } from "@subs-to/react-utils/compare/zustand";

import { initialTableItems, type DataItem } from "../shared";
import { getRandomIdWithSeed } from "@/lib/utils/random";

type TableStateRaw = {
  items: DataItem[];
};
type TableStateDerived = {
  itemsCount: number;
};

type TableState = {
  raw: TableStateRaw;
  derived: TableStateDerived;
};

type TableActions = {
  addItem: (newData?: Omit<DataItem, 'id'>) => void,
  updateItem: (id: DataItem['id'], newData: Partial<Omit<DataItem, 'id'>>) => void,
  moveItem: (oldIndex: number, newIndex: number) => void,
};

// initial state

const initialStateRaw: TableStateRaw = {
  items: initialTableItems
};

const initialState: TableState = {
  raw: initialStateRaw,
  derived: deriveState(
    {
      raw: { items: [] },
      derived: {
        itemsCount: 0,
      }
    },
    initialStateRaw,
  ),
};

function deriveState(oldState: TableState, newStateRaw: TableStateRaw): TableStateDerived {

  // initialize empty
  let itemsCount: TableStateDerived['itemsCount'] = 0;

  // iterate once the array and populate
  newStateRaw.items.forEach(() => {
    itemsCount++;
  });

  return {
    itemsCount,
  };
}


// store

type TableStore = {
  state: TableState,
  actions: TableActions,
};

function createTableStore() {
  return create<TableStore>()((setState, getState) => {

    const state: TableState = initialState;

    function updateStateAndDerive(newStateRaw: TableStateRaw) {
      const newState: TableState = {
        raw: newStateRaw,
        derived: deriveState(getState().state, newStateRaw),
      };
      setState({ state: newState });
    }

    const actions: TableActions = {
      addItem: newData => {
        const state = getState().state;
        const newItem: DataItem = {
          id: getRandomIdWithSeed(),
          name: 'New todo',
          status: 'todo',
          ...newData,
        };
        const newStateRaw: TableStateRaw = {
          items: [
            ...state.raw.items,
            newItem
          ],
        };
        updateStateAndDerive(newStateRaw);
      },
      updateItem: (id, newData) => {
        const state = getState().state;
        const newItems = state.raw.items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...newData,
            };
          }
          return item;
        });
        const newStateRaw: TableStateRaw = {
          items: newItems,
        };
        updateStateAndDerive(newStateRaw);
      },
      moveItem: (oldIndex, newIndex) => {
        const state = getState().state;

        const item = state.raw.items[oldIndex];
        if (!item) return;
        const newItems = [...state.raw.items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, item);
        const newStateRaw: TableStateRaw = {
          items: newItems,
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
  StoreProvider: TableProvider,
  useGetStore: useGetTableStore,
} = createReactStore(
  createTableStore,
);

export {
  TableProvider,
  useGetTableStore
};