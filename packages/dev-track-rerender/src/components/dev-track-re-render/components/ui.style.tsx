import React from "react";
import { Slot } from "radix-ui";

import type { UseTrackReRenderReturn } from "../hooks/use-track-rerender.js";
import { appendChildrenToFirstChildren } from "../utils/react-children.js";

// shared

const animation = "devTrackReRenderAnimation 1.5s ease-out forwards";

// shared props type

type UiProps = {
  trackRerender: UseTrackReRenderReturn,
  children: React.ReactNode;
};

// border

export const UiBorder = ({ trackRerender, children }: UiProps) => {
  const childrenToAppend = trackRerender.isMountRender ? [
    <BorderMount />,
    <BorderReRender key={trackRerender.rerenderKey} />
  ] : [
    <BorderReRender key={trackRerender.rerenderKey} />,
  ];
  const newChildren = appendChildrenToFirstChildren(children, childrenToAppend);

  return (
    <Slot.Root
      suppressHydrationWarning
      data-is-mount-render={trackRerender.isMountRender}
      data-rerender-key={trackRerender.rerenderKey}
      style={{ position: "relative" }}
    >
      {newChildren}
    </Slot.Root>
  );
};

const BorderMount = () => (
  <div
    style={{
      position: "absolute",
      inset: "4px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "yellow",
      borderRadius: "0.375rem", // Tailwind rounded-md = 6px ≈ 0.375rem
      pointerEvents: "none",
      animation,
    }}
  />
);

const BorderReRender = () => (
  <div
    style={{
      position: "absolute",
      inset: "0px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "blue",
      borderRadius: "0.375rem",
      pointerEvents: "none",
      animation,
    }}
  />
);

// dot

export const UiDots = ({ trackRerender, children }: UiProps) => (
  <div
    suppressHydrationWarning
    data-is-mount-render={trackRerender.isMountRender}
    data-rerender-key={trackRerender.rerenderKey}
    style={{
      width: '100%',
      display: "flex",
      gap: "1rem", // Tailwind gap-4 = 1rem
    }}
  >
    <div style={{ flexGrow: 1 }}>
      {children}
    </div>
    <div
      style={{
        display: "flex",
        gap: "0.5rem", // Tailwind gap-2 = 0.5rem
        alignItems: "center",
      }}
    >
      <div style={{ width: "0.75rem" /* Tailwind w-3 = 0.75rem */ }}>
        {trackRerender.isMountRender && <DotMount />}
      </div>
      <div style={{ width: "0.75rem" }}>
        <DotRender key={trackRerender.rerenderKey} />
      </div>
    </div>
  </div>
);

const DotMount = () => <Dot text="M" color="yellow" />;
const DotRender = () => <Dot text="R" color="blue" />;
const Dot = ({ text, color }: { text: string; color: string; }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem", // Tailwind gap-1 = 0.25rem
      animation,
    }}
  >
    <div
      style={{
        width: "0.5rem", // Tailwind size-2 = 0.5rem
        height: "0.5rem",
        borderRadius: "9999px",
        backgroundColor: color,
      }}
    />
    <span
      style={{
        fontSize: "0.75rem", // Tailwind text-xs ≈ 0.75rem
        lineHeight: "1",
      }}
    >
      {text}
    </span>
  </div>
);
