"use client";

import css from "./SignUpPage.module.css";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const user = await register({
        email: String(email),
        password: String(password),
      });

      setUser(user);
      router.push("/profile");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>

        <input name="email" type="email" required />
        <input name="password" type="password" required />

        <button type="submit">Register</button>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
