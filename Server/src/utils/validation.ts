import {
  isValidEmail,
  isValidName,
  validatePassword,
} from "../../../shared/utils/validation";

// Validates and sanitizes registration input
export function validateRegInput(input: {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}): { error: string } | { sanitized: { email: string; password: string; first_name: string; last_name: string } } {
  const { email, password, first_name, last_name } = input;

  if (!email || !password || !first_name || !last_name) {
    return { error: "All fields are required." };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedFirstName = first_name.trim();
  const trimmedLastName = last_name.trim();

  if (!trimmedEmail || !trimmedFirstName || !trimmedLastName) {
    return { error: "All fields are required." };
  }
  
  if (!isValidEmail(trimmedEmail)) {
    return { error: "Please enter a valid email address." };
  }

  if (!isValidName(trimmedFirstName)) {
    return { error: "First name can only contain letters, hyphens, apostrophes, periods, and spaces." };
  }
  if (!isValidName(trimmedLastName)) {
    return { error: "Last name can only contain letters, hyphens, apostrophes, periods, and spaces." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  return {
    sanitized: {
      email: trimmedEmail,
      password,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
    },
  };
}
