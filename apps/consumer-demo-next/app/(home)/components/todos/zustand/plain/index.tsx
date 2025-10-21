'use client';

import React from "react";
import { useBoolean, useInterval } from 'react-use';

import { TodosProvider, useGetTodosStore, type Todo } from "../state";
import { DEMO_CONFIG } from "../../demo-config";

import {
  UiTodoListBar,
  UiTodoListCount,
  UiTodoListCountBig,
  UiTodoListCountSmall,
  UiTodoListGlobalActions,
  UiTodoList,
  UiTodoListEmpty,
  UiTodoListItem,
} from "../../ui";

import { DevDebugJson } from "@/components/mine/dev-debug-json";


export function Todos_Zustand_Plain() {
  return (
    <TodosProvider>
      <div>
        <TodoAutoBehavior />
        <TodoListStats />
        <TodoListToolbar />
        <TodoList />
        <DebugTodo />
      </div>
    </TodosProvider>
  );
}

// debug

function DebugTodo() {
  const useTodoStore = useGetTodosStore();
  const todos = useTodoStore(store => store.state.raw.todos);

  return (
    <DevDebugJson
      label="debug"
      json={todos}
    />
  );
}

// auto behavior

function TodoAutoBehavior() {
  const useTodoStore = useGetTodosStore();
  const todosCount = useTodoStore(store => store.state.derived.todosCount);
  const actions = useTodoStore(store => store.actions);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      if (todosCount < DEMO_CONFIG.autobehavior.createToReachCount) actions.addTodo();
      else toggleIsRunning();
    },
    isRunning ? 5 : null,
  );
  return null;
}

// stats

function TodoListStats() {
  return (
    <UiTodoListBar>
      <UiTodoListCount>
        <TodoListCountTotal />
        <TodoListCountCompleted />
        <TodoListCountUncompleted />
      </UiTodoListCount>
    </UiTodoListBar>
  );
}

function TodoListCountTotal() {
  const useTodoStore = useGetTodosStore();
  const count = useTodoStore(store => store.state.derived.todosCount);
  return <UiTodoListCountBig count={count} label="Todos" />;
}
function TodoListCountCompleted() {
  const useTodoStore = useGetTodosStore();
  const count = useTodoStore(store => store.state.derived.todosCompletedCount);
  return <UiTodoListCountSmall count={count} label="Done" />;
}
function TodoListCountUncompleted() {
  const useTodoStore = useGetTodosStore();
  const count = useTodoStore(store => store.state.derived.todosUncompletedCount);
  return <UiTodoListCountSmall count={count} label="To Do" />;
}

// toolbar

function TodoListToolbar() {
  const useTodoStore = useGetTodosStore();
  const actions = useTodoStore(store => store.actions);

  return (
    <UiTodoListBar>
      <UiTodoListGlobalActions
        onAddTodo={() => actions.addTodo()}
        onDeleteAllTodo={() => actions.deleteAllTodos()}
      />
    </UiTodoListBar>
  );
}

// list

function TodoList() {
  const useTodoStore = useGetTodosStore();
  const todos = useTodoStore(store => store.state.raw.todos);

  if (todos.length === 0) {
    return (
      <UiTodoListEmpty />
    );
  }

  return (
    <UiTodoList>
      {todos.map((todo, index) => (
        <TodoListItemMemo
          key={todo.id}
          todo={todo}
          index={index}
        />
      ))}
    </UiTodoList>
  );
}

const TodoListItemMemo = React.memo(
  function TodoListItem({ todo, index }: { todo: Todo; index: number; }) {
    const useTodoStore = useGetTodosStore();
    const actions = useTodoStore(store => store.actions);

    return (
      <UiTodoListItem
        todo={todo}
        index={index}
        onDeleteTodo={() => actions.deleteTodo(todo.id)}
        onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
      />
    );
  }
);

