export function generateRandomString() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 12; // Length of the random string
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// Add this utility function to your context file
export const parseNumber = (
  value: string | number | undefined,
  fallback = 0,
): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || fallback;
  return fallback;
};
