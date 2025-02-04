import { getUserRole, getProfileByUserIdAction } from "@/actions/profiles-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StatisticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const role = await getUserRole();
  const profileResponse = await getProfileByUserIdAction(userId);
  const profile = profileResponse.data;

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Statistics</h1>
        <p>No profile found. Please create a profile first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Statistics</h1>
      
      <div className="bg-gray-900 shadow-md border border-gray-700 rounded-lg p-6 text-gray-200">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">Profile Information</h2>
            <p><span className="font-medium text-gray-300">Role:</span> {profile.role}</p>
            <p><span className="font-medium text-gray-300">Forum Messages:</span> Coming soon</p>
            <p><span className="font-medium text-gray-300">Karma:</span> Coming soon</p>
          </div>

          {role === "student" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">Student Statistics</h2>
              <p className="text-gray-300">Rating: Coming soon</p>
              <p className="text-gray-300">Tests Completed: Coming soon</p>
              <p className="text-gray-300">Challenging Topics: Coming soon</p>
            </div>
          )}

          {role === "teacher" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">Teacher Statistics</h2>
              <p className="text-gray-300">Classes Hosted: Coming soon</p>
              <p className="text-gray-300">Courses Created: Coming soon</p>
              <p className="text-gray-300">Students&apos; Challenging Topics: Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}