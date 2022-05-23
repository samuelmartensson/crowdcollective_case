import React from "react";
import styled from "styled-components";

const Header = () => {
  return (
    <Container>
      <span>Recruitment board</span>
      <img
        src="https://www.crowdcollective.com/cc-logo-black.svg"
        alt="crowd collective"
      />
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: ${(p) => p.theme.secondary};
  box-shadow: ${(p) => p.theme.shadow};
  margin: 1rem;
  border-radius: 1rem;

  img {
    width: 150px;
  }

  span {
    margin-left: 0.25rem;
    font-weight: bold;
  }
`;
