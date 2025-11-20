import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";
import toast from "react-hot-toast";
import { Loader } from "../Loader/Loader";
import Link from "next/link";


interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  isError: boolean;
}

export function NoteList({ notes, isLoading, isError }: NoteListProps) {
  const queryClient = useQueryClient();

  
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] }); 
    },
    onError: () => {
      toast.error("Error deleting note");
    },
  });

  if (isLoading) return <Loader />;

 
  if (isError) return <p>Error loading notes</p>;

 
  if (!notes || notes.length === 0) return <p>No notes found</p>;

  
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
           <Link href={`/notes/${note.id}`} scroll={false}>View details</Link>
            <button
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(note.id)}
              className={css.button}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
