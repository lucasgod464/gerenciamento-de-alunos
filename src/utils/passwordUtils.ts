// Simple hash for development purposes
export const hashPassword = async (password: string): Promise<string> => {
  return btoa(password); // Using base64 encoding for development
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return btoa(password) === hashedPassword;
};