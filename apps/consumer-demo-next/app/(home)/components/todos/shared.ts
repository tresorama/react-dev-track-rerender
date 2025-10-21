

import { getRandomIdWithSeed } from "@/lib/utils/random";

// domain types

export type Todo = {
  id: string;
  title: string;
  completed_date?: Date;
};


export const initialTodos: Todo[] = [
  { id: getRandomIdWithSeed('1'), title: 'Todo 1', completed_date: new Date('2025-01-01') },
  { id: getRandomIdWithSeed('2'), title: 'Todo 2', completed_date: new Date('2025-04-22') },
  { id: getRandomIdWithSeed('3'), title: 'Todo 3' },
];