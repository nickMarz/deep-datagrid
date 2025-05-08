import { Task } from '@/types/task';
import { mockUsers } from './mockUsers';
import { faker } from '@faker-js/faker';

// Task statuses with their relative weights
const taskStatuses = [
  { status: 'To Do', weight: 0.3 },
  { status: 'In Progress', weight: 0.4 },
  { status: 'In Review', weight: 0.2 },
  { status: 'Done', weight: 0.1 },
];

// Generate a random number of assignees (0-3) for a task
const generateAssignees = () => {
  const numAssignees = faker.number.int({ min: 0, max: 3 });
  if (numAssignees === 0) return [];
  
  // Randomly select users without duplicates
  const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numAssignees);
};

// Generate a single mock task
const generateMockTask = (id: number): Task => {
  // Generate a weighted random status
  const random = Math.random();
  let cumulativeWeight = 0;
  let selectedStatus = taskStatuses[0].status;
  
  for (const { status, weight } of taskStatuses) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      selectedStatus = status;
      break;
    }
  }

  return {
    id: `TASK-${id.toString().padStart(5, '0')}`,
    title: faker.helpers.arrayElement([
      faker.company.catchPhrase(),
      faker.lorem.sentence(),
      faker.helpers.multiple(() => faker.hacker.phrase(), { count: 1 })[0],
    ]),
    status: selectedStatus,
    assignees: generateAssignees(),
  };
};

// Generate 10,000 mock tasks
export const mockTasks: Task[] = Array.from({ length: 100 }, (_, index) => 
  generateMockTask(index + 1)
); 