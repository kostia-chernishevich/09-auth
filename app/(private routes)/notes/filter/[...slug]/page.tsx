import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../../../../lib/api/serverApi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ===========================
   METADATA (БЕЗ Promise!)
   =========================== */
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const rawTag = params.slug?.[0] ?? "all";

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

/* ===========================
   PAGE
   =========================== */
export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) notFound();

  const rawTag = slug[0] ?? "all";
  const tag = rawTag === "all" ? undefined : rawTag;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["notes", { tag: rawTag }],
    queryFn: () =>
      fetchNotes({
        tag,
        page: 1,
        limit: 12,
        search: "",
      }),
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
