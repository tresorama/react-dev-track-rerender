import { getRandomIdWithSeed } from "../../utils/random";
import { createReactContextStore } from "./create-react-context-store";

// domain types  
type Todo = {
  id: string;
  title: string;
  completed_date?: Date,
};


// store types

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

export const initialTodos: Todo[] = [
  { id: getRandomIdWithSeed(1), title: 'Todo 1', completed_date: new Date('2025-01-01') },
  { id: getRandomIdWithSeed(2), title: 'Todo 2', completed_date: new Date('2025-04-22') },
  { id: getRandomIdWithSeed(3), title: 'Todo 3' },
];

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

// ctx

const {
  Provider: TodosProvider,
  useStoreState: useTodosState,
  useStoreActions: useTodosActions,
} = createReactContextStore<TodoState, TodoActions>(
  () => initialState,
  (setState) => {

    function calculateNewState(oldState: TodoState, newStateRaw: TodoStateRaw) {
      const newState: TodoState = {
        raw: newStateRaw,
        derived: deriveTodoState(oldState, newStateRaw),
      };
      return newState;
    }

    return {
      addTodo: (newData) => {
        setState((state) => {
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
          return calculateNewState(state, newStateRaw);
        });
      },
      deleteAllTodos: () => {
        setState((state) => {
          const newStateRaw: TodoStateRaw = {
            todos: [],
          };
          return calculateNewState(state, newStateRaw);
        });
      },
      deleteTodo: (todoId) => {
        setState((state) => {
          const newTodos: TodoStateRaw['todos'] = state.raw.todos.filter((todo) => todo.id !== todoId);
          const newStateRaw: TodoStateRaw = {
            todos: newTodos,
          };
          return calculateNewState(state, newStateRaw);
        });
      },
      updateTodo: (todoId, newData) => {
        setState((state) => {
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
          return calculateNewState(state, newStateRaw);
        });
      },
      moveTodo: (oldIndex, newIndex) => {
        setState((state) => {
          const todo = state.raw.todos[oldIndex];
          if (!todo) return state;
          const newTodos = [...state.raw.todos];
          newTodos.splice(oldIndex, 1);
          newTodos.splice(newIndex, 0, todo);
          const newStateRaw: TodoStateRaw = {
            todos: newTodos,
          };
          return calculateNewState(state, newStateRaw);
        });
      }
    };
  }
);

export {
  TodosProvider,
  useTodosState,
  useTodosActions,
};