import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page", // ⬅ додано description
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <div className="profile">
      <Image src={user.avatar} width={120} height={120} alt="Avatar" />
      <h1>{user.username}</h1>
      <p>{user.email}</p>

      <Link href="/profile/edit" className="edit-btn">
        Edit profile
      </Link>
    </div>
  );
}
