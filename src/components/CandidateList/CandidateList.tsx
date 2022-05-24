import Button from "components/Button";
import TextField from "components/TextField";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CloseIcon, QueuedIcon, SearchIcon } from "../../assets/icons";
import { database } from "../../firebase";
import CandidateListColumn from "./CandidateListColumn";
import CandidateListModal from "./CandidateListModal";

const candidateFields = ["name", "age", "email", "address"] as const;

export type FormFields = typeof candidateFields[number];
export type Candidate = Record<FormFields, string> & {
  id: string;
  category: string;
};
export type Categories = Record<Category, Record<string, DocumentData>>;
export type Category =
  | "contact"
  | "dialogue"
  | "interview"
  | "offer"
  | "closed";

const CATEGORIES: Categories = {
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
      setValue(key as FormFields, value);
    });
    setModalOpen(true);
  };

  const onSubmit = (fieldValues: Omit<Candidate, "id">) => {
    setLoading(true);

    if (selectedCandidate) {
      updateCandidate(fieldValues);
    } else {
      addCandidate(fieldValues);
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
        <LoadingIndicator>
          <QueuedIcon />
        </LoadingIndicator>
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
            <CandidateListColumn
              key={category}
              {...{ candidates, category, searchTerm, selectCandidate }}
            />
          );
        })}
      </Lists>
      <CandidateListModal
        heading={selectedCandidate ? "Edit" : "Add"}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCandidate(undefined);
          reset();
        }}
        onDelete={removeCandidate}
        onSubmit={handleSubmit(onSubmit)}
        categoryList={Object.keys(CATEGORIES) as Category[]}
        {...{
          candidateFields,
          errors,
          loading,
          register,
          selectedCandidate,
          selectedCategory,
          setSelectedCategory,
        }}
      />
    </Container>
  );
};

export default CandidateList;

const Container = styled.div`
  padding: 1rem;
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

const LoadingIndicator = styled.div`
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
