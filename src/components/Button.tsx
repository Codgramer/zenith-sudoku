import clsx from "clsx";
import * as React from "react";
import {twMerge} from "tailwind-merge";

const Button = ({
  children,
  className,
  disabled,
  active,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        clsx(
          "rounded-sm border-none bg-primary text-white dark:bg-primary dark:text-white md:px-4 md:py-2 px-2 py-1 shadow-sm transition-all hover:brightness-90 focus:outline-none disabled:bg-gray-400 disabled:dark:bg-gray-700 disabled:text-gray-200 disabled:cursor-not-allowed",
          className,
          {
            "scale-110 brightness-90": active,
          },
        ),
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;