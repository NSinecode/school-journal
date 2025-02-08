'use client';

type Props = {
  classroomId: number;
}

export default function InviteButton({ classroomId }: Props) {
  return (
    <button
      onClick={() => {
        const inviteLink = `${window.location.origin}/classroom/invite?id=${classroomId}`;
        navigator.clipboard.writeText(inviteLink);
        alert('Invite link copied to clipboard!');
      }}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      Generate Invite Link
    </button>
  );
} 