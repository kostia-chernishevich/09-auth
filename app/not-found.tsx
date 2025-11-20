import { Metadata } from "next";
import css from "./not-found.module.css"

 export const metadata: Metadata = {
    title: "Page not found",
    description: "Page is offline",
    openGraph: {
      title: "Page not found",
    description: "Page is offline",
      url:`https://07-routing-nextjs-khaki-pi.vercel.app/404`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,

        },
      ],
      type: 'website',
    }
  };
const NotFound = () => {
    return (
        <div>
       <h1 className={css.title}>404 - Page not found</h1>
<p className={css.description}>Sorry, the page you are looking for does not exist.</p>
</div>
    )
}
export default NotFound;