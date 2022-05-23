import React, { useState } from "react";
import styled from "styled-components";

interface CategoryPickerProps<T> {
  active?: string;
  list: T[];
  onSelect: (item: T) => void;
}

const CategoryPicker = <T extends string>({
  active,
  list,
  onSelect,
}: CategoryPickerProps<T>) => {
  const [selected, setSelected] = useState("");

  return (
    <Container>
      {list.map((item, index) => (
        <Pill
          key={item + index}
          onClick={() => {
            onSelect(item);
            setSelected(item);
          }}
          selected={item === selected || item === active}
        >
          {item}
        </Pill>
      ))}
    </Container>
  );
};

export default CategoryPicker;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Pill = styled.div<{ selected: boolean }>`
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.primary};
  padding: 0.25rem 1rem;
  text-transform: capitalize;
  cursor: pointer;
  color: ${(p) => (p.selected ? p.theme.secondary : p.theme.primary)};
  background-color: ${(p) =>
    p.selected ? p.theme.primary : p.theme.secondary};

  &:hover {
    background-color: ${(p) => p.theme.primary};
    color: ${(p) => p.theme.secondary};
  }
`;
