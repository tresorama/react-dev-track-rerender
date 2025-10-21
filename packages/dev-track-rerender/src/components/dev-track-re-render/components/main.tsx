'use client';

/* eslint-disable react/no-children-prop */
import React from "react";

import { useDevTrackRerenderCtx, type Ctx } from "./provider.js";
import { useTrackRerender } from "../hooks/use-track-rerender.js";

import { UiBorder, UiDots } from "./ui.style.js";


export function DevTrackRerender({
  variant,
  children
}: {
  /** {@link Ctx.defaultVariant} */
  variant?: Ctx['defaultVariant'],
  children: React.ReactNode;
}) {

  // context state
  const ctx = useDevTrackRerenderCtx();

  // local state
  const trackRerender = useTrackRerender();

  // derived state
  const resolvedVariant = variant ?? ctx.defaultVariant;

  // render
  if (!ctx.isEnabled) return children;

  if (resolvedVariant === 'border') {
    return (
      <UiBorder
        trackRerender={trackRerender}
        children={children}
      />
    );
  }

  if (resolvedVariant === 'dots') {
    return (
      <UiDots
        trackRerender={trackRerender}
        children={children}
      />
    );
  }

  throw new Error(`[DevTrackRerender]: Unknown variant: ${resolvedVariant}`);
}

