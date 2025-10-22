import { useSortable } from '@dnd-kit/react/sortable';

export function SortableItemWrapper({
  sortableId,
  index,
  children,
  // asDragger = false,
}: {
  sortableId: string;
  index: number;
  children: React.ReactNode,
  // asDragger?: boolean;
}) {
  const { ref: sortableRef } = useSortable({ id: sortableId, index });
  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   opacity: isDragging ? 0 : 1,
  // };

  return (
    <div ref={sortableRef}>
      {children}
    </div>
  );
}
