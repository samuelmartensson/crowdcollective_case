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
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background-color: ${(p) => p.theme.secondary};
  box-shadow: ${(p) => p.theme.shadow};
  margin: 1rem 3rem;
  border-radius: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
  }

  img {
    width: 150px;
  }

  @media (max-width: 800px) {
    svg,
    img {
      display: none;
    }
  }

  span {
    margin-left: 0.25rem;
    font-weight: bold;
    font-size: 1.5rem;
    border-bottom: 5px dotted ${(p) => p.theme.primary};
  }
`;
