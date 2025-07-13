// In-memory storage for demonstration purposes. In a production environment,
// you would typically use a persistent store like Redis or a database.
const dailyGenerations = new Map<string, { count: number; lastReset: number }>();
const totalStoredDesigns = new Map<string, number>();

const DAILY_LIMIT = Number.MAX_SAFE_INTEGER; // Temporarily set to no limit for testing
const TOTAL_STORAGE_LIMIT = 40;

/**
 * Checks if a user has exceeded their daily generation limit.
 * Resets the count daily.
 * @param userId The ID of the user.
 * @returns True if the user can generate, false otherwise.
 */
export function checkDailyGenerationLimit(userId: string): boolean {
  const now = Date.now();
  const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);

  const userEntry = dailyGenerations.get(userId);

  if (!userEntry || userEntry.lastReset < twentyFourHoursAgo) {
    // Reset if no entry or last reset was more than 24 hours ago
    dailyGenerations.set(userId, { count: 1, lastReset: now });
    return true;
  } else if (userEntry.count < DAILY_LIMIT) {
    userEntry.count++;
    dailyGenerations.set(userId, userEntry);
    return true;
  }

  return false; // Limit exceeded
}

/**
 * Increments the count of stored designs for a user and checks if the total storage limit is exceeded.
 * @param userId The ID of the user.
 * @returns True if the design can be stored, false otherwise.
 */
export function checkAndIncrementTotalStorage(userId: string): boolean {
  const currentCount = totalStoredDesigns.get(userId) || 0;

  if (currentCount < TOTAL_STORAGE_LIMIT) {
    totalStoredDesigns.set(userId, currentCount + 1);
    return true;
  }

  return false; // Storage limit exceeded
}

/**
 * Decrements the count of stored designs for a user.
 * Useful if a design is deleted.
 * @param userId The ID of the user.
 */
export function decrementTotalStorage(userId: string): void {
  const currentCount = totalStoredDesigns.get(userId) || 0;
  if (currentCount > 0) {
    totalStoredDesigns.set(userId, currentCount - 1);
  }
}
