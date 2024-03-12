import React from "react";

const sizes = {
  "5xl": "text-[22px] font-thin",
  xs: "text-xs font-normal",
  lg: "text-[15px] font-normal",
  s: "text-[13px] font-normal",
  "2xl": "text-[17px] font-medium",
  "3xl": "text-lg font-medium",
  "4xl": "text-xl font-thin",
  xl: "text-base font-normal",
  md: "text-sm font-normal",
};

const Text = ({ children, className = "", as, size = "xl", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-indigo-300 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
