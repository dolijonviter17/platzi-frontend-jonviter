import React from "react";

export type ContainerState = {
  children?: React.ReactNode;
  className?: string;
};

export default function Container({ className, children }: ContainerState) {
  return (
    <div
      className={["mx-auto max-w-6xl px-6 py-10", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
