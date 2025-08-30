import { cn } from "@/lib/utils";
import type * as React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function SiteContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
