// components/NoteList/NoteList.tsx
"use client";

import css from "./NoteList.module.css";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  isError: boolean;
}

export function NoteList({ notes, isLoading, isError }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong</p>;
  if (!notes.length) return <p>No notes yet</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <Link href={`/notes/${note.id}`} className={css.title}>
            {note.title}
          </Link>
          <p className={css.content}>{note.content}</p>
          <span className={css.tag}>{note.tag}</span>

          <button
            type="button"
            className={css.deleteBtn}
            onClick={() => mutation.mutate(note.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
