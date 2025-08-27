'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase } from 'src/lib/supabase';
import toast from 'react-hot-toast';
import { LoadingState } from 'src/components/ui/feedback';
// import useAuthStore from 'src/hooks/useAuthStore';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // OAuth is not configured for this project, redirect to home
        toast('OAuth authentication is not configured');
        router.push('/');
        
        
        // Below code is for Supabase OAuth (currently disabled)
        /* 
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Sync with backend to create/update user in local database
          const baseUrl = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';
          
          const response = await fetch(`${baseUrl}/api/auth/oauth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              user: session.user,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Update auth store
            useAuthStore.getState().setUser({
              id: userData.id,
              email: userData.email,
              firstName: userData.firstName || userData.first_name || '',
              lastName: userData.lastName || userData.last_name || '',
              hasCompletedOnboarding: userData.hasCompletedOnboarding || false,
            });

            toast.success('Successfully signed in with Google!');
            
            // Redirect based on onboarding status
            if (userData.hasCompletedOnboarding) {
              router.push('/');
            } else {
              router.push('/onboarding');
            }
          } else {
            throw new Error('Failed to sync with backend');
          }
        } else {
          throw new Error('No session found');
        }
        */
      } catch {
        // Auth callback error
        toast.error('Authentication failed. Please try again.');
        router.push('/');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center">
      <LoadingState size="lg" color="emerald" text="Completing sign in..." fullHeight />
    </div>
  );
}