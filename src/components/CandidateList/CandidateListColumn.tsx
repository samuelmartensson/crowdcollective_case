import styled from "styled-components";
import { ListIcon, ProfilePlaceholderIcon } from "assets/icons";
import { motion } from "framer-motion";
import { Candidate, Categories, Category } from "./CandidateList";

interface CandidateListColumnProps {
  candidates: Categories;
  category: Category;
  searchTerm: string;
  selectCandidate: (
    candidate: Candidate & {
      category: Category;
    }
  ) => void;
}

const CandidateListColumn = ({
  category,
  candidates,
  searchTerm,
  selectCandidate,
}: CandidateListColumnProps) => {
  return (
    <div>
      <ColumnHead>
        <ListIcon /> {category}
      </ColumnHead>
      {(Object.values(candidates[category]) as Candidate[])
        .filter((item) =>
          Object.values(item).find((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .map((item) => (
          <Row
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            onClick={() => selectCandidate({ ...item, category })}
            key={item.id}
          >
            <ProfilePlaceholderIcon />
            <div>
              <div className="text primary">{item.name}</div>
              <div className="text secondary">{item.email}</div>
            </div>
          </Row>
        ))}
    </div>
  );
};

export default CandidateListColumn;

const ColumnHead = styled.div`
  text-transform: capitalize;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(p) => p.theme.dividerColor};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Row = styled(motion.div)`
  padding: 1.25rem 1rem;
  border-radius: 0.25rem;
  box-shadow: ${(p) => p.theme.shadow};
  background-color: ${(p) => p.theme.secondary};
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition-duration: 250ms;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 3px solid ${(p) => p.theme.primary};

  svg {
    width: 3rem;
    height: 3rem;
  }

  .text {
    word-break: break-word;
  }

  .primary {
    font-weight: bold;
  }

  .secondary {
    font-size: 0.75rem;
    color: ${(p) => p.theme.secondaryText};
  }

  &:hover {
    box-shadow: ${(p) => p.theme.shadow2};
  }
`;
