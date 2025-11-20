import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(
  paramsPromise: Promise<{ slug: string[] }>
): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const rawTag = slug?.[0] ?? "all";

  return {
    title: `Notes tagged: ${rawTag}`,
    description: `List of notes filtered by tag ${rawTag} on NoteHub.`,
    openGraph: {
      title: `Notes tagged: ${rawTag}`,
      description: `List of notes filtered by tag ${rawTag} on NoteHub.`,
      url: `https://07-routing-nextjs-khaki-pi.vercel.app/notes/filter/${rawTag}`,
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
}


export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const rawTag = slug?.[0] ?? "all";
  const tag = rawTag === "all" ? undefined : rawTag;

  if (!rawTag) notFound();

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["notes", { tag: rawTag }],
    queryFn: () => fetchNotes({ tag, page: 1, perPage: 12, search: "" }),
  });

  const state = dehydrate(qc);

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Notes tagged: {rawTag}
      </h1>
      <HydrationBoundary state={state}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </>
  );
}
