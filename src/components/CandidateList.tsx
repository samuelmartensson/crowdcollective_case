import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  DocumentData,
  addDoc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import styled from "styled-components";
import { useForm } from "react-hook-form";

import Button from "./Button";
import Modal from "./Modal";
import TextField from "./TextField";
import CategoryPicker from "./CategoryPicker";

import { database } from "../firebase";
import { DeleteIcon, QueuedIcon } from "../assets/icons";

const candidateFields = ["name", "age", "email", "address"] as const;

type Candidate = Record<typeof candidateFields[number], string> & {
  id: string;
  category: string;
};
type Category = "contact" | "dialogue" | "interview" | "offer" | "closed";

const CATEGORIES: Record<Category, Record<string, DocumentData>> = {
  contact: {},
  dialogue: {},
  interview: {},
  offer: {},
  closed: {},
};

const CandidateList = () => {
  const { register, setValue, handleSubmit, reset, formState } =
    useForm<Candidate>();
  const { errors } = formState;
  const [candidates, setCandidates] = useState(CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [loading, setLoading] = useState(true);

  const resetState = () => {
    setLoading(false);
    setModalOpen(false);
    setSelectedCandidate(undefined);
  };

  const addCandidate = async (candidate: Omit<Candidate, "id">) => {
    await addDoc(collection(database, "candidates"), {
      ...candidate,
      category: "contact",
    });
  };

  const updateCandidate = async (candidate: Omit<Candidate, "id">) => {
    if (!selectedCandidate?.id) return;

    const { address, age, email, name } = candidate;
    await updateDoc(doc(database, "candidates", selectedCandidate?.id), {
      address,
      age,
      email,
      name,
      category: !!selectedCategory
        ? selectedCategory
        : selectedCandidate.category,
    });
  };

  const removeCandidate = async () => {
    if (!selectedCandidate?.id) return;
    setLoading(true);

    await deleteDoc(doc(database, "candidates", selectedCandidate?.id));

    resetState();
  };

  const selectCandidate = (candidate: Candidate & { category: Category }) => {
    setSelectedCategory(candidate.category);
    setSelectedCandidate(candidate);
    Object.entries(candidate).forEach(([key, value]) => {
      setValue(key as typeof candidateFields[number], value);
    });
    setModalOpen(true);
  };

  const onSubmit = async (fieldValues: Candidate) => {
    setLoading(true);

    if (selectedCandidate) {
      await updateCandidate(fieldValues);
    } else {
      await addCandidate(fieldValues);
    }

    resetState();
  };

  useEffect(() => {
    (async () => {
      const q = query(collection(database, "candidates"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = { ...CATEGORIES };
          querySnapshot.forEach((doc) => {
            const documentData = doc.data();

            data[documentData.category] = {
              ...data[documentData.category],
              [doc.id]: { ...documentData, id: doc.id },
            };
          });

          setCandidates(data);
          setLoading(false);
        },
        () => {}
      );

      return () => {
        unsubscribe();
      };
    })();
  }, []);

  return (
    <Container>
      {loading && (
        <LoadingOverlay>
          <QueuedIcon />
        </LoadingOverlay>
      )}
      <AddButton
        onClick={() => {
          reset();
          setModalOpen(true);
          setSelectedCategory("contact");
        }}
        color="primary"
      >
        Add new
      </AddButton>
      <Lists>
        {(Object.keys(CATEGORIES) as Category[]).map((category) => {
          return (
            <Column key={category}>
              <ColumnHead>{category}</ColumnHead>
              {(Object.values(candidates[category]) as Candidate[]).map(
                (item) => (
                  <Row
                    onClick={() => selectCandidate({ ...item, category })}
                    key={item.id}
                  >
                    <div className="primary">{item.name}</div>
                    <div className="secondary">{item.email}</div>
                  </Row>
                )
              )}
            </Column>
          );
        })}
      </Lists>
      <Modal
        closeOnOverlayClick
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCandidate(undefined);
          reset();
        }}
        type="info"
      >
        <ModalContent>
          <ModalHeading>{selectedCandidate ? "Edit" : "Add"}</ModalHeading>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              list={Object.keys(CATEGORIES) as Category[]}
            />
            <ActionBar>
              <Button flexGrow={false} type="submit">
                {selectedCandidate ? "Save" : "Submit"}
              </Button>
              <Button
                onClick={removeCandidate}
                flexGrow={false}
                color="material"
                iconLeft={<DeleteIcon />}
              />
            </ActionBar>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CandidateList;

const ModalHeading = styled.h2`
  margin-bottom: 1rem;
`;

const AddButton = styled(Button)`
  position: fixed;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
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
  margin-bottom: 1rem;
`;

const ModalContent = styled.div`
  border-radius: 1rem;
  padding: 2rem;
  background-color: ${(p) => p.theme.secondary};
  max-width: 900px;
  min-width: 340px;
`;

const Container = styled.div`
  padding: 1rem;
`;

const Lists = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(
    ${() => Object.keys(CATEGORIES).length},
    minmax(200px, 1fr)
  );
`;

const Row = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: ${(p) => p.theme.shadow};
  background-color: ${(p) => p.theme.secondary};
  margin-bottom: 1rem;
  cursor: pointer;
  transition-duration: 250ms;

  > * {
    word-break: break-all;
  }

  .primary {
    font-weight: bold;
  }

  .secondary {
    font-size: 1rem;
    color: ${(p) => p.theme.secondaryText};
  }

  &:hover {
    box-shadow: ${(p) => p.theme.shadow2};
  }
`;

const ColumnHead = styled.div`
  text-transform: capitalize;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${(p) => p.theme.borderColor};
`;

const Column = styled.div``;

const LoadingOverlay = styled.div`
  display: grid;
  place-items: center;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: ${(p) => p.theme.primary};
  z-index: 101;

  svg {
    width: 34px;
    height: 34px;
  }
`;
