import { Counter_RC } from "./components/counter/react-context";

// import { Todos_RC_SortableDndKit_VirtualizedVirtua } from "./components/todos/react-context/sortable-dnd-kit--virtualized-virtua";
// import { Todos_Zustand_SortableDndKit_VirtualizedVirtua } from "./components/todos/zustand/sortable-dnd-kit--virtualized-virtua";
// import { Todos_SubsTo_SortableDndKit_VirtualizedVirtua } from "./components/todos/subs-to/sortable-dnd-kit--virtualized-virtua";

// import { Table_Zustand_Plain } from "./components/table/zustand/plain";

import { cn } from "@/components/shadcn/lib/utils";

export default function Home() {
  return (
    <main className="py-16 px-8">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-center items-center gap-16">
        <SectionCounters />
        {/* <SectionTodos /> */}
        {/* <SectionTable /> */}
      </div>
    </main>
  );
}

const SectionCounters = () => (
  <UiSection>
    <UiSectionTitle text="Counters" />
    <UiSectionContent className="grid-cols-3">
      <UiSectionContentItem text="subs-to">
        <Counter_RC />
        <Counter_RC />
        <Counter_RC />
        <Counter_RC />
      </UiSectionContentItem>
    </UiSectionContent>
  </UiSection>
);

// const SectionTodos = () => (
//   <UiSection>
//     <UiSectionTitle text="Todos" />
//     <UiSectionContent className="grid-cols-3">
//       <UiSectionContentItem text="react context - Sortable (dnd-kit) + Virtualized (virtua)">
//         <Todos_RC_SortableDndKit_VirtualizedVirtua />
//       </UiSectionContentItem>
//       <UiSectionContentItem text="zustand - Sortable (dnd-kit) + Virtualized (virtua)">
//         <Todos_Zustand_SortableDndKit_VirtualizedVirtua />
//       </UiSectionContentItem>
//       <UiSectionContentItem text="subs-to - Sortable (dnd-kit) + Virtualized (virtua)">
//         <Todos_SubsTo_SortableDndKit_VirtualizedVirtua />
//       </UiSectionContentItem>
//     </UiSectionContent>
//   </UiSection>
// );

// const SectionTable = () => (
//   <UiSection>
//     <UiSectionTitle text="Table" />
//     <UiSectionContent className="grid-cols-3">
//       <div />
//       <UiSectionContentItem text="zustand - plain">
//         <Table_Zustand_Plain />
//       </UiSectionContentItem>
//     </UiSectionContent>
//   </UiSection>
// );


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

