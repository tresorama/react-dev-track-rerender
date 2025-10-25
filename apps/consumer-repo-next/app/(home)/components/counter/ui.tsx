import { DevTrackRerender } from "@tresorama/react-dev-track-rerender";
import { MinusIcon, PlusIcon } from "lucide-react";

import { UiButton } from "@/components/mine/button";
import { UiCard } from "@/components/mine/card";

export const UiCounterCard = ({ children }: { children: React.ReactNode; }) => (
  <DevTrackRerender>
    <UiCard className="py-4 px-6 flex items-center gap-4">
      {children}
    </UiCard>
  </DevTrackRerender>
);

export const UiCounterCount = ({ count }: { count: number; }) => (
  <DevTrackRerender>
    <span className="min-w-[3ch] text-2xl text-center">
      {count}
    </span>
  </DevTrackRerender>
);

export const UiCounterIsZeroLabel = ({ isZero }: { isZero: boolean; }) => (
  <DevTrackRerender>
    <span className="mx-auto text-sm text-muted-foreground">
      isZero: {isZero ? "✅" : "❌"}
    </span>
  </DevTrackRerender>
);

export const UiCounterActions = ({
  onIncrement,
  onDecrement,
}: {
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div className="">
    <DevTrackRerender>
      <div className="flex gap-2">
        <UiButton size="icon" onClick={onIncrement}>
          <PlusIcon />
        </UiButton>
        <UiButton size="icon" onClick={onDecrement}>
          <MinusIcon />
        </UiButton>
      </div>
    </DevTrackRerender>
  </div>
);