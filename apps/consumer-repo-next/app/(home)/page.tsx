import { Counter_RC } from "./components/counter/react-context";

import { cn } from "@/components/shadcn/lib/utils";

export default function Home() {
  return (
    <main className="py-16 px-8">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-center items-center gap-16">
        <SectionCounters />
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

