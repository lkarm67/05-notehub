import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { NoteTag, CreateNoteParams } from "../../types/note";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { Pagination }  from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import { NoteForm }  from "../NoteForm/NoteForm";
import type { NoteFormValues } from "../NoteForm/NoteForm";
import { SearchBox } from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
	
  const queryClient = useQueryClient();
  
  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); 
  }, 500);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", searchQuery, page],
    queryFn: () => fetchNotes({ search: searchQuery, page, perPage: 10 }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

	const deleteNoteMutation = useMutation({
	  mutationFn: deleteNote,
	  onSuccess: () => {
        toast.success("Note deleted!");
        queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleCreateNote = (values: NoteFormValues) => {
	const payload: CreateNoteParams = {
	  title: values.title,
	  content: values.content,
	  tag: values.tag as NoteTag, // явне приведення типу
	};
  
	createNoteMutation.mutate(payload);
	setIsModalOpen(false);
  };
  

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <div className={css.container}>
		<header className={css.header}>
			<Toaster />
			<SearchBox
				  search={searchInput}
				  onSearchChange={value => {
				    setSearchInput(value);
				    updateSearchQuery(value);
				  }}
			/>
			  {data && (
				  <Pagination
					  pageCount={data.totalPages}
					  currentPage={page}
					  onPageChange={setPage}
				  />
			  )}  
			  <button
				  className={css.createButton}
				  onClick={() => setIsModalOpen(true)}>
                    Create note + 
              </button>
	    </header>
		  
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {data && (
          <NoteList
            notes={data.notes}
            onDelete={handleDeleteNote}
          />
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm
              onSubmit={handleCreateNote}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        )}
    </div>
  );
}
