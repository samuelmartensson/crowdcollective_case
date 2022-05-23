import { ChangeEvent } from "react";
import { RegisterOptions, FieldError, UseFormRegister } from "react-hook-form";

import styled from "styled-components";
import ErrorMessage from "./ErrorMessage";

interface TextProps {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  register?: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
  hidden?: boolean;
  transparent?: boolean;
  borderSize?: "lg" | "md";
  defaultValue?: string;
  style?: any;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  [rest: string]: any;
}

const Text = ({
  name,
  type = "text",
  borderSize = "lg",
  placeholder,
  label,
  disabled,
  register,
  validation = {},
  error,
  hidden,
  transparent,
  defaultValue = "",
  style,
  onChange,
  ...rest
}: TextProps) => {
  return (
    <Container
      style={style}
      transparent={transparent}
      borderSize={borderSize}
      hidden={hidden}
      disabled={disabled}
      {...rest}
    >
      {!!label && <Label disabled={disabled}>{label}</Label>}
      <input
        type={type}
        disabled={disabled}
        autoComplete="off"
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register?.(name, validation)}
        onChange={onChange}
      />
      <ErrorMessage error={error} />
    </Container>
  );
};

export default Text;

const Label = styled.div<{ disabled?: boolean }>`
  font-weight: 500;
  font-size: 15px;
  top: -10px;
  position: absolute;
  left: 10px;
  background: white;
  padding: 0 5px;
  color: ${(p) => (!p.disabled ? p.theme.primaryText : p.theme.secondaryText)};
`;

const Container = styled.div<{
  transparent?: boolean;
  hidden?: boolean;
  borderSize?: "lg" | "md";
  disabled?: boolean;
}>`
  display: ${(p) => (p.hidden ? "none" : "block")};
  max-width: 400px;
  position: relative;

  input {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 5px 15px;
    height: 54px;
    font-size: 14px;
    border-radius: ${(p) => (p.borderSize === "md" ? "5px" : "10px")};
    background: ${(p) => (p.transparent ? "transparent" : p.theme.secondary)};
    outline: none;
    transition: 200ms ease;

    &:hover,
    &:focus {
      ${(p) => !p.disabled && `box-shadow: 0 0 0 4px ${p.theme.lightPrimary};`}
    }
    &:focus {
      border: 1px solid ${(p) => p.theme.primary};
    }
    &::placeholder {
      color: ${(p) => p.theme.secondaryText};
    }
  }
`;
