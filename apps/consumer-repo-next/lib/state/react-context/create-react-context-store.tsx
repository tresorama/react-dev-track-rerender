'use client';


import { createContext, useContext, useMemo, useState } from 'react';

type CreateCtxState<TState> = { state: TState, setState: React.Dispatch<React.SetStateAction<TState>>; };
type CreateCtxActions<TActions> = { actions: TActions; };


export function createReactContextStore<TState, TActions>(
  createStoreFn: () => TState,
  createActionsFn: (setState: CreateCtxState<TState>['setState']) => TActions
) {

  // ctx

  type CtxState = CreateCtxState<TState>;
  type CtxActions = CreateCtxActions<TActions>;

  const ctxState = createContext({} as CtxState['state']);
  const ctxSetState = createContext({} as CtxState['setState']);
  const ctxActions = createContext({} as CtxActions);


  const useContextState = () => {
    const value = useContext(ctxState);
    if (!value) {
      throw new Error('useContextState must be used within a ProviderState');
    }
    return value;
  };
  const useContextSetState = () => {
    const value = useContext(ctxSetState);
    if (!value) {
      throw new Error('useContextState must be used within a ProviderState');
    }
    return value;
  };
  const useContextActions = () => {
    const value = useContext(ctxActions);
    if (!value) {
      throw new Error('useContextActions must be used within a ProviderActions');
    }
    return value;
  };

  const ProviderState = ({ children }: { children: React.ReactNode; }) => {
    const [state, setState] = useState<TState>(() => createStoreFn());

    return (
      <ctxState.Provider value={state}>
        <ctxSetState.Provider value={setState}>
          {children}
        </ctxSetState.Provider>
      </ctxState.Provider>
    );
  };

  const ProviderActions = ({ children }: { children: React.ReactNode; }) => {
    const setState = useContextSetState();
    const actions = useMemo<TActions>(() => createActionsFn(setState), [setState]);
    const value: CtxActions = { actions };

    return (
      <ctxActions.Provider value={value}>
        {children}
      </ctxActions.Provider>
    );
  };

  // exposed

  const Provider = ({ children }: { children: React.ReactNode; }) => {
    return (
      <ProviderState>
        <ProviderActions>
          {children}
        </ProviderActions>
      </ProviderState>
    );
  };

  const useStoreState = () => useContextState();
  const useStoreActions = () => useContextActions().actions;


  return {
    Provider,
    useStoreState,
    useStoreActions,
  };

}
