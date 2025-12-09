"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { Note } from "@/types/note";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error || !data) return <p>Note not found</p>;

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <p>Tag: {data.tag}</p>
    </article>
  );
}
