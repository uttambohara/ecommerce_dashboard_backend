import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractNumber(text: string) {
  // Regular expression to match numbers with optional decimal point
  const numberRegex = /\d+(?:\.\d+)?/;

  // Extract the number
  const numberMatch = numberRegex.exec(text);
  const number = numberMatch ? parseFloat(numberMatch[0]) : null;

  return number;
}
