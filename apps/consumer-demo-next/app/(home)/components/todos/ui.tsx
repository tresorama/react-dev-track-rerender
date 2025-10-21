import { PlusIcon, Trash2Icon } from 'lucide-react';
import { DevTrackRerender } from "@subs-to/react-utils/components/dev-track-render";

import type { Todo } from "./shared";

import { UiButton } from "@/components/mine/button";
import { UiCard } from '@/components/mine/card';
import { UiToggler } from "@/components/mine/toggler";

export const UiTodoListBar = ({ children }: { children: React.ReactNode; }) => (
  <DevTrackRerender>
    <UiCard className='mb-4'>
      {children}
    </UiCard>
  </DevTrackRerender>
);

export const UiTodoListCount = ({ children }: { children: React.ReactNode; }) => (
  <DevTrackRerender>
    <div className="py-2 grid grid-cols-2 justify-center gap-4">
      {children}
    </div>
  </DevTrackRerender>
);
export const UiTodoListCountBig = ({ count, label }: { count: number; label: string; }) => (
  <div className="col-span-2">
    <DevTrackRerender>
      <div className="flex justify-center gap-2 text-4xl">
        <span>{count}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    </DevTrackRerender>
  </div>
);
export const UiTodoListCountSmall = ({ count, label }: { count: number; label: string; }) => (
  <div className="even:justify-self-end odd:justify-self-start">
    <DevTrackRerender>
      <div className="flex gap-2">
        <span>{count}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    </DevTrackRerender>
  </div>
);


export const UiTodoListGlobalActions = ({
  onAddTodo,
  onDeleteAllTodo,
}: {
  onAddTodo: () => void;
  onDeleteAllTodo: () => void;
}) => (
  <div className="flex justify-end gap-4">
    <UiButton variant="outline" onClick={onDeleteAllTodo}>
      <Trash2Icon />
      Delete All
    </UiButton>
    <UiButton variant="primary" onClick={onAddTodo}>
      <PlusIcon />
      Add Todo
    </UiButton>
  </div>
);



export const UiTodoListEmpty = () => (
  <p className="px-4 py-2 text-muted-foreground italic text-sm">
    No todos
  </p>
);

export const UiTodoList = ({ children }: { children: React.ReactNode; }) => (
  <div className="max-h-[40dvh] overflow-y-auto flex flex-col gap-2">
    {children}
  </div>
);

export const UiTodoListItem = ({
  index,
  todo,
  onDeleteTodo,
  onToggleCompleted,
  elRef,
  divProps,
  extraLeft,
  extraRight,
}: {
  index: number,
  todo: Todo,
  onDeleteTodo: () => void;
  onToggleCompleted: () => void;
  elRef?: React.RefObject<HTMLDivElement>;
  divProps?: React.ComponentProps<'div'>,
  extraLeft?: React.ReactNode;
  extraRight?: React.ReactNode;
}) => (
  <div {...divProps} ref={elRef}>
    <DevTrackRerender>
      <UiCard className="py-1.5 flex items-center">
        {extraLeft && (
          <div className="mr-2">
            {extraLeft}
          </div>
        )}
        <div className="min-w-[3ch] NOborder text-muted-foreground rounded text-xs text-center">
          {index + 1}
        </div>
        <div className="min-w-[9ch] ml-2 NOborder text-muted-foreground rounded text-xs" suppressHydrationWarning>
          {todo.id}
        </div>
        <div className="ml-2 flex-grow text-sm">
          {todo.title}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <UiToggler
            leftText="To Do"
            rightText="Done"
            checked={Boolean(todo.completed_date)}
            onCheckedChange={() => onToggleCompleted()}
            leftClassName='data-[state=active]:bg-red-400/20 data-[state=active]:text-red-50'
            rightClassName='data-[state=active]:bg-green-400/20 data-[state=active]:text-green-50'
          />
          <UiButton variant="outline" size="icon" onClick={onDeleteTodo}>
            <Trash2Icon />
          </UiButton>
        </div>
        {extraRight && (
          <div className="ml-2">
            {extraRight}
          </div>
        )}
      </UiCard>
    </DevTrackRerender>
  </div>
);