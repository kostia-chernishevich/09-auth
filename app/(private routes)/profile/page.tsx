"use client";

import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";

export const metadata = {
  title: "User Profile",
  description: "Page with information about the user",
};

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatarPlaceholder}>No avatar</div>
          )}
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? "No username"}</p>
          <p>Email: {user?.email ?? "No email"}</p>
        </div>
      </div>
    </main>
  );
}
