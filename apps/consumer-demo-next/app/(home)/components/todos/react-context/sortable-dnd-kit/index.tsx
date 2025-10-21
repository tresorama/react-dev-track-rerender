'use client';

import React from "react";
import { useBoolean, useInterval } from 'react-use';
import { GripHorizontalIcon } from "lucide-react";

import { TodosProvider, useTodosState, useTodosActions, type Todo } from "../state";
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

import { SortableList, SortableListItemDragHandler, SortableListItemWrapper } from "@/components/mine/dnd-kit";
import { DevDebugJson } from "@/components/mine/dev-debug-json";


export function Todos_RC_SortableDndKit() {
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
  const todos = useTodosState().raw.todos;
  return (
    <DevDebugJson
      label="debug"
      json={todos}
    />
  );
}

// auto behavior

function TodoAutoBehavior() {
  const todosCount = useTodosState().derived.todosCount;
  const actions = useTodosActions();
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
  const count = useTodosState().derived.todosCount;
  return <UiTodoListCountBig count={count} label="Todos" />;
}
function TodoListCountCompleted() {
  const count = useTodosState().derived.todosCompletedCount;
  return <UiTodoListCountSmall count={count} label="Done" />;
}
function TodoListCountUncompleted() {
  const count = useTodosState().derived.todosUncompletedCount;
  return <UiTodoListCountSmall count={count} label="To Do" />;
}

// toolbar

function TodoListToolbar() {
  const actions = useTodosActions();

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
  const todos = useTodosState().raw.todos;
  const actions = useTodosActions();

  if (todos.length === 0) {
    return (
      <UiTodoListEmpty />
    );
  }

  return (
    <SortableList
      items={todos}
      onSwapItems={(oldIndex, newIndex) => actions.moveTodo(oldIndex, newIndex)}
      renderOverlayItem={(todo, index) => (
        <TodoListItemMemo
          todo={todo}
          index={index}
        />
      )}
    >
      <UiTodoList>
        {todos.map((todo, index) => (
          <SortableListItemWrapper
            key={todo.id}
            sortableId={todo.id}
          >
            <TodoListItemMemo
              todo={todo}
              index={index}
            />
          </SortableListItemWrapper>
        ))}
      </UiTodoList>
    </SortableList>
  );
}

const TodoListItemMemo = React.memo(
  function TodoListItem({ todo, index }: { todo: Todo; index: number; }) {
    const actions = useTodosActions();

    return (
      <UiTodoListItem
        todo={todo}
        index={index}
        onDeleteTodo={() => actions.deleteTodo(todo.id)}
        onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
        extraLeft={(
          <SortableListItemDragHandler sortableId={todo.id}>
            <GripHorizontalIcon className="size-4" />
          </SortableListItemDragHandler>
        )}
      />
    );
  }
);


