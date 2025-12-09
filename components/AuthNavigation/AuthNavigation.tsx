"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();        // виклик API
      clearAuth();           // очищаємо глобальний стан
      router.push("/login"); // перенаправлення
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) {
    return (
      <nav>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    );
  }

  return (
    <nav>
      <span>{user.email}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
