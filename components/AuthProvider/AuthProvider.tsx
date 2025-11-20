"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [isChecking, setIsChecking] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser, clearIsAuthenticated } = useAuthStore();

  // які маршрути вважаємо приватними / auth
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  useEffect(() => {
    const verify = async () => {
      setIsChecking(true);

      try {
        const sessionUser = await checkSession();

        if (sessionUser) {
          // юзер є → зберігаємо у Zustand
          setUser(sessionUser);

          // якщо вже залогінений, але відкрив /sign-in або /sign-up → ведемо в профіль
          if (isAuthRoute) {
            router.push("/profile");
            return;
          }
        } else {
          // сесії немає
          clearIsAuthenticated();

          // якщо це приватна сторінка → вихід і редірект на /sign-in
          if (isPrivateRoute) {
            await logout();
            router.push("/sign-in");
            return;
          }
        }
      } catch (error) {
        // на всякий випадок: в разі помилки поводимось як при відсутності сесії
        clearIsAuthenticated();

        if (isPrivateRoute) {
          router.push("/sign-in");
          return;
        }
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [
    pathname,
    isAuthRoute,
    isPrivateRoute,
    router,
    setUser,
    clearIsAuthenticated,
  ]);

  // поки триває перевірка — нічого не показуємо
  if (isChecking) {
    return null; // тут можна буде поставити лоадер
  }

  // додатковий захист: якщо приватна сторінка без юзера — не рендеримо контент
  if (isPrivateRoute && !user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
