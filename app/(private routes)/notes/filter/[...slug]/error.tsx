"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Something went wrong 😔</h1>
      <p>{error.message}</p>
    </div>
  );
}
