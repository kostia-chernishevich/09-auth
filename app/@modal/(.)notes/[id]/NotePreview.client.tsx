"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Modal } from "../../../../components/Modal/Modal";

export default function NotePreview() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading note...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Failed to load note.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => router.back()}>
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <div>
          <span>{note.tag}</span>
          <span> | </span>
          <span>Created at: {new Date(note.createdAt).toLocaleString()}</span>
        </div>
        <button onClick={() => router.back()}>Close</button>
      </div>
    </Modal>
  );
}
