import { cn } from "../shadcn/lib/utils";

export const DevDebugJson = ({
  label,
  json,
  className,
}: {
  label?: string;
  json: unknown;
  className?: React.ComponentProps<'div'>['className'];
}) => (
  <div className={cn("my-6 border rounded-md", className)}>
    {label && (
      <div className="px-4 py-2 border-b">
        <p className="text-xs">{label}</p>
      </div>
    )}
    <div className="max-h-[20dvh] overflow-y-auto text-muted-foreground">
      <pre
        suppressHydrationWarning
        style={{
          maxWidth: '100%',
          maxHeight: 'inherit',
          overflow: 'auto',
          padding: '0.5rem',
          whiteSpace: 'pre',
          fontSize: '0.65rem',
        }}
      >
        {JSON.stringify(json, null, 4)}
      </pre>
    </div>
  </div>
);