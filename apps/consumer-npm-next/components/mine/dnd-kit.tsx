import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from 'radix-ui';

export function SortableList<TItem extends { id: UniqueIdentifier; }>({
  items,
  onSwapItems,
  renderOverlayItem,
  children,
}: {
  items: TItem[],
  onSwapItems: (oldIndex: number, newIndex: number) => void,
  renderOverlayItem?: (item: TItem, index: number) => React.ReactNode,
  children: React.ReactNode,
}) {
  const [activeItemId, setActiveItemId] = useState<TItem['id'] | null>(null);
  const activeItem = useMemo(
    () => {
      if (activeItemId === null) return null;
      const index = items.findIndex((todo) => todo.id === activeItemId);
      if (index === -1) return null;
      const item = items[index];
      if (!item) return null;
      return { item, index };
    },
    [activeItemId, items]
  );

  return (
    <DndContext
      onDragStart={event => setActiveItemId(event.active.id)}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
          const oldId = active.id;
          const newId = over.id;
          const oldIndex = items.findIndex(item => item.id === oldId);
          const newIndex = items.findIndex(item => item.id === newId);
          onSwapItems(oldIndex, newIndex);
          setActiveItemId(null);
        }
      }}
    >
      <SortableContext items={items}>
        {children}
      </SortableContext>
      {renderOverlayItem && (
        <DragOverlay>
          {activeItem ? renderOverlayItem(activeItem.item, activeItem.index) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
}

export function SortableListItemWrapper({
  sortableId,
  children,
  asDragger = false,
  className,
  asChild,
}: {
  sortableId: string;
  children: React.ReactNode,
  asDragger?: boolean;
  className?: React.ComponentProps<'div'>['className'];
  asChild?: boolean,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  } as const;
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      ref={setNodeRef}
      style={style}
      {...(asDragger ? attributes : {})}
      {...(asDragger ? listeners : {})}
      className={className}
      data-sortable-id={sortableId}
      aria-describedby='null'
    >
      {children}
    </Comp>
  );
}

export function SortableListItemDragHandler({
  sortableId,
  children,
}: {
  sortableId: string;
  children: React.ReactNode,
}) {
  const { attributes, listeners } = useSortable({ id: sortableId });
  return (
    <div {...attributes} {...listeners}>
      {children}
    </div>
  );
}