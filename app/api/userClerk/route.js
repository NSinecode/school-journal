import { clerkClient, auth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = auth();
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    return res.status(200).json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}