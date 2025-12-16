"use client";

import css from "./SignInPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";


export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


 const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setError(null);

  const formData = new FormData(event.currentTarget);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await login({
      email: String(email),
      password: String(password),
    });

    router.push("/profile");
  } catch {
    setError("Invalid email or password");
  }
};


  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
