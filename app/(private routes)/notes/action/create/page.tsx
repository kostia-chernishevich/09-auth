import { NoteForm } from "@/components/NoteForm/NoteForm"
import css from "./CreateNote.module.css"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Create new note — NoteHub",
    description: "Page for creating a new note on NoteHub.",
    openGraph: {
        title: "Create new note — NoteHub",
        description: "Page for creating a new note on NoteHub.",
        url: `https://07-routing-nextjs-khaki-pi.vercel.app/notes/action/create`,
        siteName: "NoteHub",
        images: [
            {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
    },
};

const CreateNotePage = () => {
    return (
        <main className={css.main}>
  <div className={css.container}>
    <h1 className={css.title}>Create note</h1>
	   {<NoteForm/>}
  </div>
</main>
    )
}
export default CreateNotePage;