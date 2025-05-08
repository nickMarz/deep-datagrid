import { NextResponse } from 'next/server';
import { UserSearchResponse } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '1000');

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );

  const response: UserSearchResponse = {
    users: filteredUsers.slice(0, limit),
    total: filteredUsers.length,
  };

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(response);
} 