import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ search, onSearchChange }) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};