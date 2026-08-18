import { api } from '@/lib/api';
import type { Class, ListResponse, MutationResponse, Student } from '@/types/api';

// Fetches all classes. The endpoint wraps the array in `{ data }`, so we
// unwrap it here — hooks/components always get a plain Class[].
export async function getClasses(): Promise<Class[]> {
  const response = await api.get<ListResponse<Class>>('/classes');
  return response.data.data;
}

// Fetches a single class by id. Unlike the collection endpoint, this one
// returns the Class object directly (no `{ data }` envelope) — the API's
// inconsistency is absorbed here so callers never need to know about it.
export async function getClass(classId: string): Promise<Class> {
  const response = await api.get<Class>(`/classes/${classId}`);
  return response.data;
}

// Fetches the students enrolled in a class, optionally filtered by a
// server-side search term (matches full name or student id). Always pass
// the term through to the API rather than filtering a full list client-side.
export async function getClassStudents(classId: string, search?: string): Promise<Student[]> {
  const response = await api.get<ListResponse<Student>>(`/classes/${classId}/students`, {
    params: search ? { search } : undefined,
  });
  return response.data.data;
}

// Enrolls an existing student into a class. Returns the raw mutation
// envelope (message + enrolled student) so the caller can surface the
// server's own success message.
export async function enrollStudent(
  classId: string,
  studentId: string
): Promise<MutationResponse<Student>> {
  const response = await api.post<MutationResponse<Student>>(`/classes/${classId}/students`, {
    studentId,
  });
  return response.data;
}

// Removes a student from a class. Returns the raw mutation envelope
// (message only — no data payload on this endpoint).
export async function removeStudent(classId: string, studentId: string): Promise<MutationResponse> {
  const response = await api.delete<MutationResponse>(`/classes/${classId}/students/${studentId}`);
  return response.data;
}
