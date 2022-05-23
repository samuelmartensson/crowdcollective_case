import CandidateList from "components/CandidateList";
import Header from "components/Header";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <Header />
      <CandidateList />
    </Container>
  );
}

export default App;

const Container = styled.div`
  max-width: 1920px;
  margin: auto;
`;
