'use client';

import React from "react";
import { GripHorizontalIcon } from "lucide-react";
import { useBoolean, useInterval } from "react-use";
import { VList } from "virtua";

import { TodosProvider, useTodosState, useTodosActions, type Todo } from "../state";
import {
  UiTodoListBar,
  UiTodoListCount,
  UiTodoListCountBig,
  UiTodoListCountSmall,
  UiTodoListGlobalActions,
  UiTodoListEmpty,
  UiTodoListItem,
} from "../../ui";

import { SortableList, SortableListItemWrapper, SortableListItemDragHandler } from "@/components/mine/dnd-kit";
import { DevDebugJson } from "@/components/mine/dev-debug-json";
import { DEMO_CONFIG } from "../../demo-config";


export function Todos_SubsTo_SortableDndKit_VirtualizedVirtua() {
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
  const todos = useTodosState(state => state.raw.todos);
  return (
    <DevDebugJson
      label="debug"
      json={todos}
    />
  );
}

// auto behavior

function TodoAutoBehavior() {
  const todosCount = useTodosState(state => state.derived.todosCount);
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
  const count = useTodosState(state => state.derived.todosCount);
  return <UiTodoListCountBig count={count} label="Todos" />;
}
function TodoListCountCompleted() {
  const count = useTodosState(state => state.derived.todosCompletedCount);
  return <UiTodoListCountSmall count={count} label="Done" />;
}
function TodoListCountUncompleted() {
  const count = useTodosState(state => state.derived.todosUncompletedCount);
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
  const todos = useTodosState(state => state.raw.todos);
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
          originalIndex={index}
        />
      )}
    >
      <VList style={{ height: '40dvh' }}>
        {todos.map((todo, index) => (
          <SortableListItemWrapper
            key={todo.id}
            sortableId={todo.id}
            className="pb-2"
          >
            <TodoListItemMemo
              todo={todo}
              originalIndex={index}
            />
          </SortableListItemWrapper>
        ))}
      </VList>
    </SortableList>
  );
}

const TodoListItemMemo = React.memo(
  function TodoListItem({ todo, originalIndex }: { todo: Todo, originalIndex: number; }) {
    const actions = useTodosActions();

    return (
      <UiTodoListItem
        todo={todo}
        index={originalIndex}
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
)


