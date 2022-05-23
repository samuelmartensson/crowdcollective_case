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
import {
  CloseIcon,
  DeleteIcon,
  ListIcon,
  ProfilePlaceholderIcon,
  QueuedIcon,
  SearchIcon,
} from "../assets/icons";

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
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resetState = () => {
    setLoading(false);
    setModalOpen(false);
    setSelectedCandidate(undefined);
  };

  const setErrorState = (message: string) => {
    setError(message);
    setLoading(false);
  };

  const addCandidate = async (candidate: Omit<Candidate, "id">) => {
    try {
      await addDoc(collection(database, "candidates"), {
        ...candidate,
        category: "contact",
      });

      resetState();
    } catch (err) {
      setErrorState("Failed to add");
    }
  };

  const updateCandidate = async (candidate: Omit<Candidate, "id">) => {
    if (!selectedCandidate?.id) return;
    setLoading(true);

    const { address, age, email, name } = candidate;

    try {
      await updateDoc(doc(database, "candidates", selectedCandidate?.id), {
        address,
        age,
        email,
        name,
        category: !!selectedCategory
          ? selectedCategory
          : selectedCandidate.category,
      });

      resetState();
    } catch (err) {
      setErrorState("Failed to update");
    }
  };

  const removeCandidate = async () => {
    if (!selectedCandidate?.id) return;
    setLoading(true);

    try {
      await deleteDoc(doc(database, "candidates", selectedCandidate?.id));

      resetState();
    } catch (err) {
      setErrorState("Failed to delete");
    }
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
      {error && (
        <ErrorToast onClick={() => setError("")}>
          <div>{error}</div>
          <div className="info">Click to dismiss</div>
        </ErrorToast>
      )}
      <FloatingActionBar>
        {!searchActive && (
          <Button
            onClick={() => {
              reset();
              setModalOpen(true);
              setSelectedCategory("contact");
            }}
            color="primary"
          >
            Add new
          </Button>
        )}
        {searchActive && (
          <TextField
            name="search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        )}
        <Button
          flexGrow={false}
          onClick={() => setSearchActive((state) => !state)}
          color="material"
          iconLeft={searchActive ? <CloseIcon /> : <SearchIcon />}
        />
      </FloatingActionBar>
      <Lists>
        {(Object.keys(CATEGORIES) as Category[]).map((category) => {
          return (
            <div key={category}>
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
              <Button flexGrow={false} type="submit" loading={loading}>
                {selectedCandidate ? "Save" : "Add"}
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

const FloatingActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: fixed;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  min-width: 320px;
  height: 50px;
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

const ModalContent = styled.div`
  border-radius: 1rem;
  padding: 2rem;
  background-color: ${(p) => p.theme.secondary};
  width: clamp(320px, 90vw, 600px);
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
  overflow: auto;
  height: 80vh;
  padding: 2rem;
`;

const Row = styled.div`
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

const ErrorToast = styled.div`
  text-align: center;
  min-width: 320px;
  position: fixed;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(p) => p.theme.error};
  color: ${(p) => p.theme.secondary};
  padding: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  z-index: 102;

  .info {
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }
`;
