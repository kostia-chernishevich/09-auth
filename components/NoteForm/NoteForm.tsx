"use client";
import css from "./NoteForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNotePayload } from "../../lib/api";
import type { NoteTag } from "../../types/note";
import { toast } from "react-hot-toast";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";

export function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/all");
      toast.success("Note created");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Error creating note");
    },
  });

  async function handleSubmit(formData: FormData) {
    const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
    const rawTag = formData.get("tag");
    const tag = allowedTags.includes(rawTag as NoteTag)
      ? (rawTag as NoteTag)
      : "Todo";

    const note: CreateNotePayload = {
      title: (formData.get("title") as string) || "",
      content: (formData.get("content") as string) || "",
      tag,
    };

    await mutation.mutateAsync(note);
  }

  // ✅ Додано функцію для кнопки Cancel
  const handleCancel = () => {
    clearDraft();
    router.back();
    toast("Changes discarded");
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          value={draft.title}
          onChange={handleChange}
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          value={draft.content}
          onChange={handleChange}
          name="content"
          rows={8}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          onChange={handleChange}
          name="tag"
          className={css.select}
          value={draft.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          onClick={handleCancel}
          type="button"
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
