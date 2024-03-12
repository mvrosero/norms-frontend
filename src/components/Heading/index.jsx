import React from "react";

const sizes = {
  xl: "text-[28px] font-semibold",
  s: "text-xl font-semibold",
  md: "text-[22px] font-semibold",
  xs: "text-[17px] font-semibold",
  lg: "text-[25px] font-black",
};

const Heading = ({ children, className = "", size = "md", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-blue_gray-800_01 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
