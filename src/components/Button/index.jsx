import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[27px]",
  circle: "rounded-[50%]",
};
const variants = {
  fill: {
    white_A700: "bg-white-A700 shadow-xs",
    pink_50: "bg-pink-50",
    pink_50_01: "bg-pink-50_01",
    indigo_A700: "bg-indigo-A700 text-white-A700",
    orange_50: "bg-orange-50",
    cyan_50: "bg-cyan-50",
    blue_50: "bg-blue-50",
    gray_100: "bg-gray-100",
  },
  outline: {
    indigo_300: "border-indigo-300 border-2 border-solid",
  },
};
const sizes = {
  sm: "h-[40px] px-4 text-[15px]",
  md: "h-[50px] px-[35px] text-lg",
  xl: "h-[55px] px-[13px]",
  "3xl": "h-[70px] px-[19px]",
  "2xl": "h-[60px] px-[17px]",
  xs: "h-[30px] px-[9px]",
  lg: "h-[50px] px-3",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "",
  variant = "fill",
  size = "lg",
  color = "gray_100",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["round", "circle"]),
  size: PropTypes.oneOf(["sm", "md", "xl", "3xl", "2xl", "xs", "lg"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "white_A700",
    "pink_50",
    "pink_50_01",
    "indigo_A700",
    "orange_50",
    "cyan_50",
    "blue_50",
    "gray_100",
    "indigo_300",
  ]),
};

export { Button };
