export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

export interface Class {
  id: string;
  name: string;
  studentIds: string[];
}

// Envelope for collection endpoints, e.g. GET /classes, GET /students.
// `total` is present on endpoints that report a count separate from
// `data.length` (e.g. server-side filtered lists); optional elsewhere.
export interface ListResponse<T> {
  data: T[];
  total?: number;
}

// Envelope for mutation endpoints (POST/DELETE), e.g. enroll/remove student.
// `data` is omitted on mutations that only return a confirmation message.
export interface MutationResponse<T = unknown> {
  message: string;
  data?: T;
}