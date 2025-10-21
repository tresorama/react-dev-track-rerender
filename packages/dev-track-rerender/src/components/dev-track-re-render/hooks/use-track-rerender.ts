import { useFirstMountState } from "./use-first-mount-state.js";


export const useTrackRerender = () => {
  const isMountRender = useFirstMountState();
  const rerenderKey = Date.now();

  return {
    /** A boolean that is true on first render (mount) */
    isMountRender,
    /** A key that changes on every rerender */
    rerenderKey,
  };
};

export type UseTrackReRenderReturn = ReturnType<typeof useTrackRerender>;
