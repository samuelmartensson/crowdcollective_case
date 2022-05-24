import styled from "styled-components";
import CandidateList from "components/CandidateList/CandidateList";
import Header from "components/Header/Header";

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
