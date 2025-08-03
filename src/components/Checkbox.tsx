import * as React from "react";

const Checkbox: React.FC<{
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}> = ({id, onChange, checked, children}) => {
  return (
    <div className="relative flex items-center">
      <div className="flex h-5 items-center">
        <input
          checked={checked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked);
            // So the keyboard works again.
            // TODO: find a better solution for this.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
          id={id}
          aria-describedby={`${id}-description`}
          name={id}
          type="checkbox"
          className="h-6 w-6 rounded border-gray-300 text-primary-accent focus:ring-primary"
        />
      </div>
      <div className="ml-3 text-text-primary dark:text-white">{children}</div>
    </div>
  );
};

export default Checkbox;