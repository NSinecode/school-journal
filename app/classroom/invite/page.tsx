'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole } from '@/actions/profiles-actions';
import { addStudentToClassroom } from '@/actions/classroom-actions';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [setIsChecking] = useState(true);

  useEffect(() => {
    async function handleInvite() {
      if (!id) return;
      
      const role = await getUserRole();
      if (role !== 'student') {
        router.push('/statistis');
        return;
      }

      const result = await addStudentToClassroom(id);
      if (result.status === 'error') {
        // You might want to redirect to an error page here
        router.push('/classroom?error=join-failed');
        return;
      }

      router.push(`/classroom?id=${id}`);
    }

    handleInvite();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
