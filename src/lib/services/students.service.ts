import { api } from '@/lib/api';
import type { ListResponse, Student } from '@/types/api';

// Fetches all students. The endpoint wraps the array in `{ data, total }`,
// so we unwrap it here — hooks/components always get a plain Student[].
export async function getStudents(): Promise<Student[]> {
  const response = await api.get<ListResponse<Student>>('/students');
  return response.data.data;
}

// Fetches a single student by id. Unlike the collection endpoint, this one
// returns the Student object directly (no `{ data }` envelope) — the API's
// inconsistency is absorbed here so callers never need to know about it.
export async function getStudent(studentId: string): Promise<Student> {
  const response = await api.get<Student>(`/students/${studentId}`);
  return response.data;
}
