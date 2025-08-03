import * as React from "react";

export const Container = ({children, className = "", ...props}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`max-w-screen-xl mx-auto p-4 sm:p-6 md:p-8 ${className}`} {...props}>
    {children}
  </div>
);