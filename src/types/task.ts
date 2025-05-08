import { User } from './user';

export interface Task {
  id: string;
  title: string;
  status: string;
  assignees: User[];
} 