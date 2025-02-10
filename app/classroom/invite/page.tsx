'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getUserRole, addClassroomToUserAction } from '@/actions/profiles-actions';
import { addStudentToClassroom } from '@/actions/classroom-actions';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    async function handleInvite() {
      if (!id) return;
      
      const role = await getUserRole();
      if (role !== 'student') {
        router.push('/statistics');
        return;
      }

      const result = await addStudentToClassroom(id);
      if (result.status === 'already_enrolled') {
        router.push(`/classroom`);
        return;
      }
      
      if (result.status === 'error') {
        router.push('/classroom?error=join-failed');
        return;
      }

      // Add this classroom to user's my_classroom array
      await addClassroomToUserAction(id);
      
      router.push(`/classroom`);
    }

    handleInvite();
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
