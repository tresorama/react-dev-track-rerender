import { createContext, useContext, useState } from "react";
import type { create, StoreApi, UseBoundStore } from 'zustand';

/**
 * Function that create a zustand store instance in a react context, and provider react utils to use the store
 */
export function createZustandStore<
  TStore,
  TZustandUseStore = UseBoundStore<StoreApi<TStore>>
>(
  /** A function that creates the zustand store, must use {@link create} inside */
  createStoreFn: () => TZustandUseStore
) {

  // react context

  type Ctx = { useStore: TZustandUseStore; };
  const ctx = createContext({} as Ctx);

  const useStoreContext = () => {
    const context = useContext(ctx);
    if (!context) {
      throw new Error('useStoreContext must be used within a StoreProvider');
    }
    return context;
  };

  /**
   * React Context Provider component that initialize the zustand store.  
   * This context never re-render because the store is immutable
   */
  function StoreProvider({ children }: { children: React.ReactNode; }) {
    const [useStore] = useState(() => createStoreFn());
    return (
      <ctx.Provider value={{ useStore }}>
        {children}
      </ctx.Provider>
    );
  }

  // react utility hook

  /**
   * React hook that retrieve the zustand store
   */
  const useGetStore = () => useStoreContext().useStore;

  return {
    StoreProvider,
    useGetStore,
  };

}
