'use client'

//@ts-ignore
import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  const loginSuccess = () => {
    router.push('/dashboard'); // Redirect to your desired page after successful login
  };

  const loginError = (error: any) => {
    console.error('Login error:', error);
    router.push('/login-error'); // Redirect to an error page
  };

  return (
    <LoginCallBack 
      errorCallback={loginError} 
      successCallback={loginSuccess} 
    />
  );
}