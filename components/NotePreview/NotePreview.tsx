interface NotePreviewProps {
  note: { id: string; title: string; content: string };
}
export default function NotePreview({ note }: NotePreviewProps) {
  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}