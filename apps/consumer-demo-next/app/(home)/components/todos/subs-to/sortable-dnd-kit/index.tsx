'use client';

import React from "react";
import { GripHorizontalIcon } from "lucide-react";
import { useBoolean, useInterval } from "react-use";

import { TodosProvider, useTodosState, useTodosActions, type Todo } from "../state";
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

import { SortableList, SortableListItemWrapper, SortableListItemDragHandler } from "@/components/mine/dnd-kit";
import { DevDebugJson } from "@/components/mine/dev-debug-json";
import { DEMO_CONFIG } from "../../demo-config";


export function Todos_SubsTo_SortableDndKit() {
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

// list - no virtual

// function TodoList() {
//   const todos = useTodosState(state => state.raw.todos);
//   const actions = useTodosActions();


//   if (todos.length === 0) {
//     return (
//       <UiTodoListEmpty />
//     );
//   }

//   return (
//     <DragDropProvider
//       onDragEnd={(data) => {
//         if (isSortable(data.operation.source)) {
//           const oldIndex = data.operation.source.sortable.initialIndex;
//           const newIndex = data.operation.source.sortable.index;
//           actions.moveTodo(oldIndex, newIndex);
//         }
//       }}
//     >
//       <UiTodoList>
//         {todos.map((todo, index) => (
//           <TodoListItemMemo
//             key={todo.id}
//             todo={todo}
//             index={index}
//           />
//         ))}
//       </UiTodoList>
//     </DragDropProvider>
//   );
// }

// const TodoListItemMemo = React.memo(
//   function TodoListItem({
//     todo,
//     index,
//   }: {
//     todo: Todo;
//     index: number;
//   }) {
//     const actions = useTodosActions();
//     const { ref: sortableRef } = useSortable({ id: todo.id, index });

//     return (
//       <UiTodoListItem
//         elRef={sortableRef}
//         todo={todo}
//         index={index}
//         onDeleteTodo={() => actions.deleteTodo(todo.id)}
//         onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
//       />
//     );
//   }
// );


// list - tanstack virtual

// function TodoList() {
//   const todos = useTodosState(state => state.raw.todos);
//   const actions = useTodosActions();
//   const virtualizedItemsData = useRef<{ originalIndexes: number[]; }>({ originalIndexes: [] });


//   if (todos.length === 0) {
//     return (
//       <UiTodoListEmpty />
//     );
//   }

//   return (
//     <DragDropProvider
//       onDragEnd={(data) => {
//         if (isSortable(data.operation.source)) {
//           // get the indexes of the virtual items
//           const oldIndex = data.operation.source.sortable.initialIndex;
//           const newIndex = data.operation.source.sortable.index;
//           if (oldIndex === newIndex) return;
//           // convert these indexes to the original indexes (of the all items array)
//           const oldOriginalIndex = virtualizedItemsData.current.originalIndexes[oldIndex];
//           const newOriginalIndex = virtualizedItemsData.current.originalIndexes[newIndex];
//           if (
//             typeof oldOriginalIndex === 'undefined'
//             ||
//             typeof newOriginalIndex === 'undefined'
//           ) return;

//           actions.moveTodo(oldOriginalIndex, newOriginalIndex);
//         }
//       }}
//     >
//       <UiTodoListVirtualTanstack
//         itemsCount={todos.length}
//         onRefreshVirtualList={(inViewItemsIndexes) => {
//           virtualizedItemsData.current.originalIndexes = inViewItemsIndexes;
//         }}
//         renderItem={(virtualIndex, originalIndex) => {
//           const todo = todos[originalIndex];
//           if (!todo) throw new Error('Todo not found');
//           return (
//             <TodoListItemMemo
//               // key={todo.id}
//               todo={todo}
//               virtualIndex={virtualIndex}
//               originalIndex={originalIndex}
//             />
//           );
//         }}
//       />
//     </DragDropProvider>
//   );

//   // return (
//   //   <DragDropProvider
//   //     onDragEnd={(data) => {
//   //       if (isSortable(data.operation.source)) {
//   //         const oldIndex = data.operation.source.sortable.initialIndex;
//   //         const newIndex = data.operation.source.sortable.index;
//   //         actions.moveTodo(oldIndex, newIndex);
//   //       }
//   //     }}
//   //   >
//   //     <UiTodoList>
//   //       {todos.map((todo, index) => (
//   //         <TodoListItemMemo
//   //           key={todo.id}
//   //           todo={todo}
//   //           index={index}
//   //         />
//   //       ))}
//   //     </UiTodoList>
//   //   </DragDropProvider>
//   // );
// }

// const TodoListItemMemo = React.memo(
//   function TodoListItem({
//     todo,
//     virtualIndex,
//     originalIndex,
//   }: {
//     todo: Todo;
//     virtualIndex: number;
//     originalIndex: number;
//   }) {
//     const actions = useTodosActions();
//     const { ref: sortableRef } = useSortable({ id: todo.id, index: virtualIndex });

//     return (
//       <UiTodoListItem
//         elRef={sortableRef}
//         todo={todo}
//         index={originalIndex}
//         onDeleteTodo={() => actions.deleteTodo(todo.id)}
//         onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
//       />
//     );
//   }
// );

// list - virtua

// function TodoList() {
//   const todos = useTodosState(state => state.raw.todos);
//   const actions = useTodosActions();
//   const virtua = useVirtua();

//   if (todos.length === 0) {
//     return (
//       <UiTodoListEmpty />
//     );
//   }

//   return (
//     <DragDropProvider
//       onDragEnd={(data) => {
//         if (isSortable(data.operation.source)) {
//           debugger;
//           // get the indexes of the virtual items
//           const oldIndex = data.operation.source.sortable.initialIndex;
//           const newIndex = data.operation.source.sortable.index;
//           if (oldIndex === newIndex) return;
//           // convert these indexes to the original indexes (of the all items array)
//           const virtualOriginalIndexes = virtua.getVirtualOriginalIndexes();
//           const oldOriginalIndex = virtualOriginalIndexes[oldIndex];
//           const newOriginalIndex = virtualOriginalIndexes[newIndex];
//           if (
//             typeof oldOriginalIndex === 'undefined'
//             ||
//             typeof newOriginalIndex === 'undefined'
//           ) return;

//           actions.moveTodo(oldOriginalIndex, newOriginalIndex);
//         }
//       }}
//     >
//       <UiTodoListVirtualVirtua
//         virtuaApiRef={virtua.virtuaApiRef}
//         allItems={todos}
//         renderItem={(originalIndex) => {
//           // debugger;
//           const todo = todos[originalIndex];
//           // debugger;
//           if (!todo) throw new Error('Todo not found');
//           return (
//             <TodoListItemMemo
//               // key={todo.id}
//               todo={todo}
//               // virtualIndex={virtualIndex}
//               originalIndex={originalIndex}
//             />
//           );
//         }}
//       />
//     </DragDropProvider>
//   );

// }

// const TodoListItemMemo = React.memo(
//   function TodoListItem({
//     todo,
//     // virtualIndex,
//     originalIndex,
//   }: {
//     todo: Todo;
//     // virtualIndex: number;
//     originalIndex: number;
//   }) {
//     const actions = useTodosActions();
//     const { ref: sortableRef } = useSortable({ id: todo.id, index: originalIndex });

//     return (
//       <UiTodoListItem
//         elRef={sortableRef}
//         todo={todo}
//         index={originalIndex}
//         onDeleteTodo={() => actions.deleteTodo(todo.id)}
//         onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
//       />
//     );
//   }
// );


// list - virtua manual

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
      <UiTodoList>
        {todos.map((todo, index) => (
          <SortableListItemWrapper
            key={todo.id}
            sortableId={todo.id}
          >
            <TodoListItemMemo
              todo={todo}
              originalIndex={index}
            />
          </SortableListItemWrapper>
        ))}
      </UiTodoList>
    </SortableList>
  );

}

// const TodoListItemMemo = React.memo(
//   function TodoListItem({
//     todo,
//     // virtualIndex,
//     originalIndex,
//   }: {
//     todo: Todo;
//     // virtualIndex: number;
//     originalIndex: number;
//   }) {
//     const actions = useTodosActions();
//     const {
//       attributes,
//       listeners,
//       setNodeRef,
//       transform,
//       transition,
//     } = useSortable({ id: todo.id });
//     const style = {
//       transform: CSS.Transform.toString(transform),
//       transition,
//     };

//     return (
//       <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//         <UiTodoListItem
//           todo={todo}
//           index={originalIndex}
//           onDeleteTodo={() => actions.deleteTodo(todo.id)}
//           onToggleCompleted={() => actions.updateTodo(todo.id, { completed_date: todo.completed_date ? undefined : new Date() })}
//         />
//       </div>
//     );
//   }
// );


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


