import React from "react";
import { FieldError } from "react-hook-form";
import styled from "styled-components";

interface ErrorMessageProps {
  error?: FieldError;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (error) {
    return <Container>{error?.message || "Required *"}</Container>;
  }

  return null;
};

export default ErrorMessage;

const Container = styled.div`
  margin-top: 0.25rem;
  color: ${(p) => p.theme.error};
  font-weight: bold;
`;
