/**
 * EaseLife Server Action Result Pattern
 * Standardized discriminated union for all Next.js Server Actions.
 */

export interface ActionSuccess<T = void> {
  success: true;
  data: T;
  error?: undefined;
}

export interface ActionError {
  success: false;
  error: string;
  data?: undefined;
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

/**
 * Convenience helper to return a successful action result.
 */
export function actionSuccess<T>(data: T): ActionSuccess<T> {
  return { success: true, data };
}

/**
 * Convenience helper to return an error action result.
 */
export function actionError(error: string): ActionError {
  return { success: false, error };
}
