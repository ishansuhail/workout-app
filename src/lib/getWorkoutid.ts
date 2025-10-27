import { v5 as uuidv5 } from "uuid";

const WORKOUT_NAMESPACE = process.env.WORKOUT_NAMESPACE || '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export const getWorkoutId = (userId: string, date: Date) => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = `${userId}-${dateStr}`;
  
  return uuidv5(seed, WORKOUT_NAMESPACE);
};