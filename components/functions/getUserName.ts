import { clerkClient } from '@clerk/nextjs/server';

async function getUserNameById(userId: string): Promise<string | null> {
  try {
    // Инициализируем клиент Clerk
    const client = await clerkClient();
    
    // Получаем объект пользователя по userId
    const user = await client.users.getUser(userId);

    // Возвращаем полное имя пользователя
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    } else {
      return null; // Если пользователь не найден
    }
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return null;
  }
}

export default getUserNameById;