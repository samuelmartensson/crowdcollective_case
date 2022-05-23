import { MouseEvent, ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  color?:
    | "primary"
    | "secondary"
    | "ghost"
    | "lightPrimary"
    | "material"
    | "regular"
    | "naked";
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  flexGrow?: boolean;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconColor?: "white" | "primary";
  rounded?: boolean;
  [rest: string]: any;
}

const Button = ({
  type = "button",
  color = "secondary",
  disabled = false,
  loading = false,
  onClick,
  children,
  flexGrow = true,
  className,
  iconLeft,
  iconRight,
  iconColor,
  rounded,
  ...rest
}: ButtonProps) => {
  return (
    <Container
      className={className}
      onClick={onClick}
      rounded={rounded}
      type={type}
      disabled={disabled}
      $loading={loading}
      color={color}
      flexGrow={flexGrow}
      iconColor={iconColor}
      hasIconLeft={!!iconLeft}
      hasIconRight={!!iconRight}
      iconOnly={!!children === false}
      {...rest}
    >
      {iconLeft && iconLeft}
      {children && <span>{children}</span>}
      {iconRight && iconRight}
    </Container>
  );
};

export default Button;

const getBackgroundColor = (color, p) => {
  const {
    primary,
    primaryText,
    secondary,
    secondaryText,
    lightPrimary,
    borderColor,
  } = p.theme;
  const { $loading, disabled } = p;
  const loadingOrDisabled = $loading || disabled;

  if (color === "primary") {
    const state = loadingOrDisabled ? secondaryText : primary;
    return {
      normal: state,
      hover: state,
    };
  }
  if (color === "lightPrimary") {
    return {
      normal: loadingOrDisabled ? borderColor : lightPrimary,
      hover: loadingOrDisabled ? borderColor : primary,
    };
  }
  if (color === "secondary") {
    const state = loadingOrDisabled ? secondaryText : primaryText;
    return {
      normal: state,
      hover: state,
    };
  }
  if (color === "material") {
    return {
      normal: secondary,
      hover: loadingOrDisabled ? secondary : lightPrimary,
    };
  }
  if (color === "regular" || color === "naked") {
    const state = loadingOrDisabled ? borderColor : secondary;
    return {
      normal: state,
      hover: state,
    };
  }

  return {
    normal: "none",
    hover: loadingOrDisabled ? "none" : primaryText,
  };
};

const getTextColor = (color, p) => {
  const { primary, secondary, secondaryText, primaryText } = p.theme;
  const { $loading, disabled } = p;
  const loadingOrDisabled = $loading || disabled;
  if (color === "primary") return { normal: secondary, hover: secondary };
  if (color === "lightPrimary")
    return {
      normal: disabled ? secondaryText : primary,
      hover: loadingOrDisabled ? secondaryText : secondary,
    };
  if (color === "secondary") return { normal: secondary, hover: secondary };
  if (color === "regular" || color === "naked") {
    return {
      normal: primaryText,
      hover: loadingOrDisabled ? primaryText : primary,
    };
  }
  return {
    normal: secondaryText,
    hover: loadingOrDisabled ? "none" : secondary,
  };
};

const getBorderColor = (color, p) => {
  const { primary, primaryText, secondaryText, lightPrimary, borderColor } =
    p.theme;
  const { $loading, disabled } = p;
  const loadingOrDisabled = $loading || disabled;
  if (
    color === "primary" ||
    color === "lightPrimary" ||
    color === "secondary"
  ) {
    return { normal: "transparent", hover: "transparent" };
  }

  if (color === "material") {
    return {
      normal: borderColor,
      hover: lightPrimary,
    };
  }
  if (color === "regular") {
    return {
      normal: borderColor,
      hover: loadingOrDisabled ? primaryText : primary,
    };
  }
  if (color === "naked") {
    return {
      normal: "transparent",
      hover: primary,
    };
  }
  return {
    normal: secondaryText,
    hover: loadingOrDisabled ? "none" : primaryText,
  };
};

const getPadding = (p) => {
  if (p.iconOnly) return "0";
  if (p.hasIconLeft) return "1rem 1.5rem 1rem 1.25rem";
  if (p.hasIconRight) return "1rem 1.25rem 1rem 1.5rem";

  return "1rem 2rem";
};

const Container = styled.button<{
  $loading?: boolean;
  disabled?: boolean;
  color: string;
  flexGrow: boolean;
  iconColor?: string;
  hasIconRight?: boolean;
  hasIconLeft?: boolean;
  iconOnly?: boolean;
  rounded?: boolean;
}>`
  background: ${(p) => getBackgroundColor(p.color, p).normal};
  color: ${(p) => getTextColor(p.color, p).normal};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  padding: ${(p) => getPadding(p)};
  border: 1px solid ${(p) => getBorderColor(p.color, p).normal};
  border-radius: ${(p) => (p.iconOnly && !p.rounded ? "15px" : "999px")};
  font-size: 14px;
  cursor: ${(p) => (p.$loading || p.disabled ? "not-allowed" : "cursor")};
  transition-duration: 200ms;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: ${(p) => (p.flexGrow ? 1 : 0)};
  min-width: ${(p) => (p.iconOnly ? "50px" : "")};
  min-height: ${(p) => (p.iconOnly ? "50px" : "")};
  max-height: 51px;

  span {
    margin-left: ${(p) => (p.hasIconLeft ? "0.5rem" : "0")};
    margin-right: ${(p) => (p.hasIconRight ? "0.5rem" : "0")};
  }

  svg {
    height: 24px;
    width: 24px;
    opacity: ${(p) => p.disabled && 0.5};
  }

  path {
    ${(p) =>
      p.iconColor &&
      `
          fill: ${(p) =>
            p.iconColor === "primary" ? p.theme.primary : p.theme.secondary};
      `}
  }

  &:hover {
    background: ${(p) => getBackgroundColor(p.color, p).hover};
    color: ${(p) => getTextColor(p.color, p).hover};
    border: 1px solid ${(p) => getBorderColor(p.color, p).hover};
  }
`;
