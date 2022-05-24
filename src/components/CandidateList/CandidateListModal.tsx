import { BaseSyntheticEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import Button from "components/Button";
import CategoryPicker from "components/CategoryPicker";
import Modal from "components/Modal";
import TextField from "components/TextField";
import { DeleteIcon } from "assets/icons";
import { Candidate, Category, FormFields } from "./CandidateList";

interface CandidateListModalProps {
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isOpen: boolean;
  heading: string;
  categoryList: Category[];
  candidateFields: readonly FormFields[];
  register: UseFormRegister<Candidate>;
  errors: FieldErrors;
  loading: boolean;
  selectedCandidate?: Candidate;
  selectedCategory?: string;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
}

const CandidateListModal = ({
  onClose,
  onDelete,
  onSubmit,
  isOpen,
  heading,
  categoryList,
  candidateFields,
  register,
  errors,
  loading,
  selectedCandidate,
  selectedCategory,
  setSelectedCategory,
}: CandidateListModalProps) => {
  return (
    <Modal closeOnOverlayClick isOpen={isOpen} onClose={onClose} type="info">
      <ModalContent>
        <ModalHeading>{heading}</ModalHeading>
        <form onSubmit={onSubmit}>
          {candidateFields.map((field) => {
            return (
              <InputWrapper key={field}>
                <TextField
                  label={field.toUpperCase()}
                  name={field}
                  register={register}
                  validation={{ required: true }}
                  error={errors[field]}
                />
              </InputWrapper>
            );
          })}
          <Typography>Move to</Typography>
          <CategoryPicker
            active={selectedCategory}
            onSelect={(item) => setSelectedCategory(item)}
            list={categoryList}
          />
          <ActionBar>
            <Button flexGrow={false} type="submit" loading={loading}>
              {selectedCandidate ? "Save" : "Add"}
            </Button>
            {selectedCandidate && (
              <Button
                onClick={onDelete}
                flexGrow={false}
                color="material"
                iconLeft={<DeleteIcon />}
              />
            )}
          </ActionBar>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CandidateListModal;

const ModalHeading = styled.h2`
  margin-bottom: 1rem;
`;

const ModalContent = styled.div`
  border-radius: 0.25rem;
  padding: 2rem;
  background-color: ${(p) => p.theme.secondary};
  width: clamp(320px, 90vw, 600px);
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
`;

const Typography = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.75rem;
`;
