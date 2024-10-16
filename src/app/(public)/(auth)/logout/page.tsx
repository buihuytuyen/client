'use client';
import { useLogoutMutation } from '@/app/queries/useAuth';
import { useAppStore } from '@/components/app-provider';
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

function _Logout() {
  const { mutateAsync } = useLogoutMutation();
  const { setRole, disconnectSocket } = useAppStore();
  const router = useRouter();

  const ref = useRef<any>(null);

  const searchParam = useSearchParams();
  const refreshToken = searchParam.get('refreshToken');
  const accessToken = searchParam.get('accessToken');

  useEffect(() => {
    if (
      ref.current ||
      (refreshToken && refreshToken !== getRefreshTokenFromLocalStorage()) ||
      (accessToken && accessToken !== getAccessTokenFromLocalStorage())
    ) {
      router.push('/');
      return;
    }

    ref.current = mutateAsync;
    let timer: NodeJS.Timeout;
    mutateAsync().then(() => {
      timer = setTimeout(() => {
        ref.current = null;
      }, 1000);
      setRole(null);
      disconnectSocket();
      router.push('/login');
    });

    return () => {
      clearTimeout(timer);
    };
  }, [mutateAsync, router, refreshToken, accessToken, setRole, disconnectSocket]);

  return <div>Logout...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <_Logout />
    </Suspense>
  );
}
