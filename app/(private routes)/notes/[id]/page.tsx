import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>; 
};

export async function generateMetadata({params}:PageProps):Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `Note: ${ note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${ note.title}`,
      description: note.content.slice(0, 100)  || "Note details",
      url: `https://07-routing-nextjs-khaki-pi.vercel.app/notes/${id}`,
      images:[{
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
        
      }
      ],
      type:'website'
    }
  }
};

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params; 

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
