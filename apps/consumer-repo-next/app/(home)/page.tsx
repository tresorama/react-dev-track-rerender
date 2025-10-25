import { Counter_RC } from "./components/counter/react-context";
import { Counter_Zustand } from "./components/counter/zustand";

import { Todos_RC_Plain } from "./components/todos/react-context";
import { Todos_Zustand_SortableDndKit } from "./components/todos/zustand/sortable-dnd-kit";
import { Todos_Zustand_SortableDndKit_VirtualizedVirtua } from "./components/todos/zustand/sortable-dnd-kit--virtualized-virtua";

import { cn } from "@/components/shadcn/lib/utils";

export default function Home() {
  return (
    <main className="py-16 px-8">
      <div className="w-full max-w-[1900px] mx-auto flex flex-col justify-center items-center gap-16">
        <SectionCounters />
        <SectionTodos />
      </div>
    </main>
  );
}

const SectionCounters = () => (
  <UiSection>
    <UiSectionTitle text="Counters" />
    <UiSectionContent className="grid-cols-4">
      <UiSectionContentItem text="react-context">
        <Counter_RC />
        <Counter_RC />
        <Counter_RC />
        <Counter_RC />
      </UiSectionContentItem>
      <UiSectionContentItem text="zustand" className="col-start-3">
        <Counter_Zustand />
        <Counter_Zustand />
        <Counter_Zustand />
        <Counter_Zustand />
      </UiSectionContentItem>
    </UiSectionContent>
  </UiSection>
);

const SectionTodos = () => (
  <UiSection>
    <UiSectionTitle text="Todos" />
    <UiSectionContent className="grid-cols-4">
      <UiSectionContentItem text="react-context">
        <Todos_RC_Plain />
      </UiSectionContentItem>
      <UiSectionContentItem text="zustand + sortable (dnd-kit)" className="col-start-3">
        <Todos_Zustand_SortableDndKit />
      </UiSectionContentItem>
      <UiSectionContentItem text="zustand + sortable (dnd-kit) + virtualized (virtua)">
        <Todos_Zustand_SortableDndKit_VirtualizedVirtua />
      </UiSectionContentItem>
    </UiSectionContent>
  </UiSection>
);



// ui

const UiSection = ({ children, ...props }: React.ComponentProps<'div'>) => (
  <div {...props} className={cn("w-full space-y-8", props.className)}>
    {children}
  </div>
);

const UiSectionTitle = ({ text }: { text: string; }) => (
  <h2>{text}</h2>
);

const UiSectionContent = ({ children, ...props }: React.ComponentProps<'div'>) => (
  <div {...props} className={cn("w-full grid gap-4", props.className)}>
    {children}
  </div>
);

const UiSectionContentItem = ({ text, children, ...props }: React.ComponentProps<'div'> & { text: string; }) => (
  <div {...props} className={cn("w-full flex flex-col gap-4", props.className)}>
    <h3>{text}</h3>
    {children}
  </div>
);

