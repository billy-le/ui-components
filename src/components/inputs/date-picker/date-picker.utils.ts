export function zeroPad(number: number, padding: number) {
  if (number < 10) return number.toString().padStart(padding, '0');
  return number.toString();
}
