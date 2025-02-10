import { getUserRole, getProfileByUserIdAction } from "@/actions/profiles-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMessageCountByAuthorAction, getAuthorKarmaAction } from "@/actions/messages-actions";
import { getTeacherClassrooms } from "@/actions/classroom-actions";
import { getCoursesAction } from "@/actions/courses-actions";
import { SelectCourse } from "@/db/schema/course-schema";

export default async function StatisticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const role = await getUserRole();
  const profileResponse = await getProfileByUserIdAction(userId);
  const messageCountResponse = await getMessageCountByAuthorAction(userId);
  const karmaResponse = await getAuthorKarmaAction(userId);
  const teacherClassrooms = role === "teacher" ? await getTeacherClassrooms(userId) : [];
  const coursesResponse = role === "teacher" ? await getCoursesAction() : null;
  
  const profile = profileResponse.data;
  const messageCount = messageCountResponse.data || 0;
  const karma = karmaResponse.data || 0;
  const score = profile?.score || 0;
  const testsCompleted = profile?.tests_completed || [];
  const teacherCourses = coursesResponse?.data?.filter((course: SelectCourse) => course.author_id === userId) || [];

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
      <h1 className="text-2xl font-bold mb-4 text-white">Ваша статистика</h1>
      
      <div className="bg-gray-900 shadow-md border border-gray-700 rounded-lg p-6 text-gray-200">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">Информация о профиле</h2>
            <p><span className="font-medium text-gray-300">Роль:</span> {profile.role}</p>
            <p><span className="font-medium text-gray-300">Сообщений на форуме:</span> {messageCount}</p>
            <p><span className="font-medium text-gray-300">Karma:</span> {karma}</p>
          </div>

          {role === "student" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">Статистика студента</h2>
              <p className="text-gray-300"><span className="font-medium">Успеваемость:</span> {score}</p>
              <p className="text-gray-300">
                <span className="font-medium">Тестов завершено:</span>{" "}
                {testsCompleted.length > 0 ? testsCompleted.length : "Вы пока не завершили ни одного теста"}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Проблемные темы:</span>{" "}
                {profile.difficult_topics && profile.difficult_topics.length > 0 
                  ? profile.difficult_topics.join(", ")
                  : "Пока проблемных тем нет!"}
              </p>
              <a 
                href="/classroom"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Перейти к вашим классам
              </a>
            </div>
          )}

          {role === "teacher" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">Статистика учителя</h2>
              <p className="text-gray-300">
                <span className="font-medium">Классов создано:</span>{" "}
                {teacherClassrooms.length > 0 
                  ? teacherClassrooms.map(classroom => classroom.name).join(", ")
                  : "Пока не создано ни одного класса"}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Курсов создано :</span>{" "}
                {teacherCourses.length > 0
                  ? teacherCourses.map((course: SelectCourse) => course.title).join(", ")
                  : "Пока не создано ни одного курса"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}