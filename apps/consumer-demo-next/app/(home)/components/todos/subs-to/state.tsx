'use client';

import { createStore } from '@subs-to/core';
import { createStoreReact } from '@subs-to/react';
import { initialTodos, type Todo } from '../shared';
import { getRandomIdWithSeed } from '@/lib/utils/random';

// store state type

type TodoStateRaw = {
  todos: Todo[];
};

type TodoStateDerived = {
  todosIds: Todo['id'][],
  todosMap: Map<Todo['id'], { todo: Todo, index: number; }>,
  todosCount: number,
  todosCompletedCount: number,
  todosUncompletedCount: number,
};

type TodoState = {
  raw: TodoStateRaw,
  derived: TodoStateDerived,
};

// initial state + deriver fn

const initialStateRaw: TodoStateRaw = {
  todos: initialTodos,
};

function deriveTodoState(oldState: TodoState, newStateRaw: TodoStateRaw): TodoStateDerived {
  // initialize empty
  const todosIds: TodoStateDerived['todosIds'] = [];
  const todosMap: TodoStateDerived['todosMap'] = new Map();
  let todosCount: TodoStateDerived['todosCount'] = 0;
  let todosCompletedCount: TodoStateDerived['todosCompletedCount'] = 0;
  let todosUncompletedCount: TodoStateDerived['todosUncompletedCount'] = 0;

  // iterate once the array and populate
  newStateRaw.todos.forEach((todo, index) => {
    todosIds.push(todo.id);
    todosMap.set(todo.id, { todo, index });
    todosCount++;
    if (todo.completed_date) todosCompletedCount++;
    else todosUncompletedCount++;
  });

  return {
    todosIds,
    todosMap,
    todosCount,
    todosCompletedCount,
    todosUncompletedCount,
  };
}

const initialState: TodoState = {
  raw: initialStateRaw,
  derived: deriveTodoState(
    {
      raw: { todos: [] },
      derived: {
        todosIds: [],
        todosCount: 0,
        todosCompletedCount: 0,
        todosUncompletedCount: 0,
        todosMap: new Map(),
      }
    },
    initialStateRaw,
  ),
};

// create the store

const {
  StoreProvider: TodosProvider,
  useStoreState: useTodosState,
  useStoreActions: useTodosActions,
} = createStoreReact(
  () => createStore<TodoState>(initialState),
  (store) => {

    const updateStateAndDerivedState = (newStateRaw: TodoStateRaw) => {
      const newState: TodoState = {
        raw: newStateRaw,
        derived: deriveTodoState(store.getState(), newStateRaw),
      };
      store.setState(newState);
    };


    return {
      addTodo: (newData?: Omit<Todo, 'id' | 'completed_date'>) => {
        const newTodos: TodoStateRaw['todos'] = [
          ...store.getState().raw.todos,
          {
            id: getRandomIdWithSeed(),
            title: 'New todo',
            ...newData
          }
        ];
        updateStateAndDerivedState({ todos: newTodos });
      },
      deleteAllTodos: () => {
        updateStateAndDerivedState({ todos: [] });
      },
      deleteTodo: (todoId: Todo['id']) => {
        const newTodos: TodoStateRaw['todos'] = store.getState().raw.todos.filter((todo) => todo.id !== todoId);
        updateStateAndDerivedState({ todos: newTodos });
      },
      updateTodo: (todoId: Todo['id'], newData: Partial<Omit<Todo, 'id'>>) => {
        const oldTodo = store.getState().derived.todosMap.get(todoId);
        if (!oldTodo) return;
        const updatedTodo: Todo = {
          ...oldTodo.todo,
          ...newData,
        };
        const newTodos: TodoStateRaw['todos'] = [
          ...store.getState().raw.todos.slice(0, oldTodo.index),
          updatedTodo,
          ...store.getState().raw.todos.slice(oldTodo.index + 1),
        ];
        updateStateAndDerivedState({ todos: newTodos });
      },
      moveTodo: (oldIndex: number, newIndex: number) => {
        const state = store.getState();
        const todo = state.raw.todos[oldIndex];
        if (!todo) return;
        const newTodos = [...state.raw.todos];
        newTodos.splice(oldIndex, 1);
        newTodos.splice(newIndex, 0, todo);
        updateStateAndDerivedState({ todos: newTodos });
      },
    };
  }
);

export {
  TodosProvider,
  useTodosState,
  useTodosActions,
};