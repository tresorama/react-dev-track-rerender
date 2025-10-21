'use client';

import { createReactStore } from '@subs-to/react-utils/compare/zustand';
import { create } from 'zustand';
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

type TodoActions = {
  addTodo: (newData?: Omit<Todo, "id" | "completed_date">) => void;
  deleteAllTodos: () => void;
  deleteTodo: (todoId: Todo["id"]) => void;
  updateTodo: (todoId: Todo["id"], newData: Partial<Omit<Todo, "id">>) => void;
  moveTodo: (oldIndex: number, newIndex: number) => void;
};

// initial state + deriver fn

const initialStateRaw: TodoStateRaw = {
  todos: initialTodos,
};

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


// store

type TodoStore = {
  state: TodoState,
  actions: TodoActions,
};

function createTodoStore() {
  return create<TodoStore>((setState, getState) => {

    function updateStateAndDerive(newStateRaw: TodoStateRaw) {
      const newState: TodoState = {
        raw: newStateRaw,
        derived: deriveTodoState(getState().state, newStateRaw),
      };
      setState({ state: newState });
    }

    const state: TodoState = initialState;
    const actions: TodoActions = {
      addTodo: newData => {
        const state = getState().state;
        const newTodo: Todo = {
          id: getRandomIdWithSeed(),
          title: 'New todo',
          ...newData
        };
        const newStateRaw: TodoStateRaw = {
          todos: [
            ...state.raw.todos,
            newTodo
          ],
        };
        updateStateAndDerive(newStateRaw);
      },
      deleteAllTodos: () => {
        const newStateRaw: TodoStateRaw = {
          todos: [],
        };
        updateStateAndDerive(newStateRaw);
      },
      deleteTodo: (todoId) => {
        const state = getState().state;

        const newTodos: TodoStateRaw['todos'] = state.raw.todos.filter((todo) => todo.id !== todoId);
        const newStateRaw: TodoStateRaw = {
          todos: newTodos,
        };
        updateStateAndDerive(newStateRaw);
      },
      updateTodo: (todoId, newData) => {
        const state = getState().state;

        const oldTodo = state.derived.todosMap.get(todoId);
        if (!oldTodo) return state;
        const updatedTodo: Todo = {
          ...oldTodo.todo,
          ...newData,
        };
        const newTodos: TodoStateRaw['todos'] = [
          ...state.raw.todos.slice(0, oldTodo.index),
          updatedTodo,
          ...state.raw.todos.slice(oldTodo.index + 1),
        ];
        const newStateRaw: TodoStateRaw = {
          todos: newTodos,
        };
        updateStateAndDerive(newStateRaw);
      },
      moveTodo: (oldIndex, newIndex) => {
        const state = getState().state;

        const todo = state.raw.todos[oldIndex];
        if (!todo) return state;
        const newTodos = [...state.raw.todos];
        newTodos.splice(oldIndex, 1);
        newTodos.splice(newIndex, 0, todo);
        const newStateRaw: TodoStateRaw = {
          todos: newTodos,
        };
        updateStateAndDerive(newStateRaw);
      }
    };

    return {
      state,
      actions,
    };

  });
}

const {
  StoreProvider: TodosProvider,
  useGetStore: useGetTodosStore,
} = createReactStore(createTodoStore);

export {
  TodosProvider,
  useGetTodosStore
};