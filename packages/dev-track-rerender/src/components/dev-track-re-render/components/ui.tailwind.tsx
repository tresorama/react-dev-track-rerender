import type { UseTrackReRenderReturn } from "../hooks/use-track-rerender.js";

type UiProps = {
  trackRerender: UseTrackReRenderReturn,
  children: React.ReactNode;
};

// border

export const UiBorder = ({ trackRerender, children }: UiProps) => (
  <div
    suppressHydrationWarning
    data-is-mount-render={trackRerender.isMountRender}
    data-rerender-key={trackRerender.rerenderKey}
    className="relative"
  >
    {children}
    {trackRerender.isMountRender && (
      <BorderMount />
    )}
    <BorderReRender key={trackRerender.rerenderKey} />
  </div>
);

const BorderMount = () => (
  <div
    suppressHydrationWarning
    className="absolute inset-[4px] border-[2px] border-[yellow] rounded-md animate-[devTrackReRenderAnimation_1s_ease-in-out_forwards] pointer-events-none"
  />
);
const BorderReRender = () => (
  <div
    suppressHydrationWarning
    className="absolute inset-[0px] border-[2px] border-[blue] rounded-md animate-[devTrackReRenderAnimation_1s_ease-in-out_forwards] pointer-events-none"
  />
);



// dots

export const UiDots = ({ trackRerender, children }: UiProps) => (
  <div
    suppressHydrationWarning
    data-is-mount-render={trackRerender.isMountRender}
    data-rerender-key={trackRerender.rerenderKey}
  >
    {children}
    <div className="flex gap-2 items-center">
      <div className="w-3">
        {trackRerender.isMountRender && (
          <DotMount />
        )}
      </div>
      <div className="w-3">
        <DotReRender key={trackRerender.rerenderKey} />
      </div>
    </div>
  </div>
);

const DotMount = () => <Dot text="M" color={'yellow'} />;
const DotReRender = () => <Dot text="R" color={'green'} />;
const Dot = ({ text, color }: { text: string; color: string; }) => (
  <div className="flex flex-col gap-1 animate-[devTrackReRenderAnimation_1s_ease-in-out_forwards]">
    <div
      className="size-2 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span className="text-xs/none">
      {text}
    </span>
  </div>
);
