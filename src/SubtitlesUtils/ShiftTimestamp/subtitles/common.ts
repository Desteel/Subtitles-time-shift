export function formatTimestampPart(part: number, partLength: number): string {
  return String(part).padStart(partLength, '0');
}
