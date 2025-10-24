// utils/Helpers.ts

/**
 * Generates a random alphanumeric string of a specified length.
 * The string contains uppercase letters (A-Z) and numbers (0-9).
 * @param length The desired length of the alphanumeric string (default is 6).
 * @returns A randomly generated string.
 */
export function generateAlphanumeric(length: number = 6): string {
  // Define the set of allowed characters: A-Z and 0-9
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    // 1. Math.random() generates a random float between 0 (inclusive) and 1 (exclusive).
    // 2. Multiplying by characters.length gives a random number up to the length of the character set.
    // 3. Math.floor() rounds this down to an integer index.
    const randomIndex = Math.floor(Math.random() * characters.length);

    // 4. Append the character at the random index to the result string.
    result += characters.charAt(randomIndex);
  }

  return result;
}
