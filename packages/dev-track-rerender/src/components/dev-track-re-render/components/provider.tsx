'use client';

import React, { createContext, useContext, useMemo } from "react";

// react context

export type Ctx = {
  /** 
   * `DevTrackRerender` are enabled (true) or they should return the `children` (false) ? 
   * */
  isEnabled: boolean,
  /** 
   * Default `variant` of `DevTrackRerender`.  
   * Default is `border`.  
   * You can overwrite this at the `DevTrackRerender` level 
   * */
  defaultVariant: 'border' | 'dots';
};

const ctx = createContext({} as Ctx);

export const useDevTrackRerenderCtx = () => {
  const context = useContext(ctx);
  if (!context) {
    throw new Error('useDevTrackRerenderCtx must be used within a DevTrackReRenderGlobalProvider');
  }
  return context;
};


type DevTrackRerenderGlobalProviderProps = {
  /** {@link Ctx.isEnabled} */
  isEnabled?: Ctx['isEnabled'];
  /** {@link Ctx.defaultVariant} */
  defaultVariant?: Ctx['defaultVariant'];
  /** React Children */
  children: React.ReactNode;
};

/**
 * React Context Provider for `DevTrackRerender` components.  
 * You must render this once at the root of your app.
 */
export const DevTrackReRenderGlobalProvider = ({
  isEnabled = false,
  defaultVariant = 'border',
  children,
}: DevTrackRerenderGlobalProviderProps) => {

  const value: Ctx = useMemo(
    () => ({ isEnabled, defaultVariant }),
    [isEnabled, defaultVariant]
  );

  return (
    <ctx.Provider value={value}>
      <UiCss />
      {children}
    </ctx.Provider>
  );
};


/** React component that inject global css */
const UiCss = () => <style id={cssItem.id}>{cssItem.css}</style>;
const cssItem = {
  id: 'devTrackReRenderAnimation',
  css: `
    @keyframes devTrackReRenderAnimation {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    `
};