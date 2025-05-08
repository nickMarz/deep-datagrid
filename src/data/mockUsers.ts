import { User } from '@/types/user';
import { faker } from '@faker-js/faker';

// Generate a consistent avatar URL for a given name
const generateAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

// Generate a single mock user
const generateMockUser = (id: number): User => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  
  return {
    id: id.toString(),
    name,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    avatar: generateAvatarUrl(name),
  };
};

// Generate 10,000 mock users
export const mockUsers: User[] = Array.from({ length: 10000 }, (_, index) => 
  generateMockUser(index + 1)
); 