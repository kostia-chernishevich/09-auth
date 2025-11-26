// components/AuthProvider/AuthProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearAuth } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        const user = await checkSession();

        if (!isMounted) return;

        if (user) {
          // користувач авторизований
          setUser(user);

          // якщо він випадково на /sign-in або /sign-up — перекинемо на профіль
          if (AUTH_ROUTES.includes(pathname)) {
            router.replace('/profile');
          }
        } else {
          // неавторизований
          clearAuth();

          const isPrivate = PRIVATE_PREFIXES.some((prefix) =>
            pathname.startsWith(prefix),
          );

          if (isPrivate) {
            router.replace('/sign-in');
          }
        }
      } catch (error) {
        // у разі помилки вважаємо, що користувач неавторизований
        clearAuth();

        const isPrivate = PRIVATE_PREFIXES.some((prefix) =>
          pathname.startsWith(prefix),
        );

        if (isPrivate) {
          router.replace('/sign-in');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, setUser, clearAuth]);

  if (loading) {
    // Поки не знаємо, є сесія чи ні — нічого не рендеримо, щоб не було “мигця”
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
