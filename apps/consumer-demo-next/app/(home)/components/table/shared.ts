import { getRandomIdWithSeed } from "@/lib/utils/random";

export type DataItem = {
  id: string,
  name: string,
  status: 'todo' | 'in_progress' | 'done',
};


export const initialTableItems: DataItem[] = [
  { id: getRandomIdWithSeed(1), name: 'Todo 1', status: 'todo' },
  { id: getRandomIdWithSeed(2), name: 'Todo 2', status: 'in_progress' },
  { id: getRandomIdWithSeed(3), name: 'Todo 3', status: 'done' },
];