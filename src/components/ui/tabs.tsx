"use client";

import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

const Tabs = ({ value, onValueChange }: TabsProps) => {
  return (
    <div className="space-y-1">
      {/* The actual triggers and content are rendered by children */}
    </div>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-3 mb-6",
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ value, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-1 rounded-md bg-base-200 px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "peer-data-[state=active]:bg-primary peer-data-[state=active]:text-primary-foreground",
          className
        )}
        type="button"
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ value, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "hidden divide-y divide-base-200",
          "peer-data-[state=active]:block",
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };