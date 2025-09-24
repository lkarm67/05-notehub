import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes({ search: searchQuery, page, perPage: 12 }),
  });

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No notes found for your query.");
    }
  }, [data]);

  const handleSearch = (value: string) => {
    if (value !== searchQuery) setPage(1);
    setSearchQuery(value);
  };

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <Toaster position="top-right" reverseOrder={false} />

        <SearchBox
          value={searchQuery}
          onSearch={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && (
        <NoteList
          notes={data.notes}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onCreated={() => setPage(1)}
          />
        </Modal>
      )}
    </div>
  );
}


