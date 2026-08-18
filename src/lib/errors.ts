import { isAxiosError } from 'axios';

// Shape of the JSON body the mock API sends on 400/404/409 responses.
interface ApiErrorBody {
  message?: string;
}

// Extracts a human-readable message from a caught error, in priority order:
// 1. the API's own `{ message }` body (what the mock server sends on errors),
// 2. the error's own `message` property,
// 3. the caller-supplied fallback.
// Centralized here so every hook/service reports errors the same way
// instead of each one re-deriving it from the raw AxiosError.
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const apiMessage = error.response?.data?.message;
    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
