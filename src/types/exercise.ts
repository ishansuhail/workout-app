import { Exercise } from "@/db/schema";



export type ExerciseResult = | 
{status: 'ok', data: Exercise} | 
{status: 'need_more', data: Array< keyof Exercise >; ask: string };


