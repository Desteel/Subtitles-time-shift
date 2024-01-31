export function splitTextByLineBreak(text: string) {
  return text.split(/\n/g);
}

export function checkIsBreakString(str: string): boolean {
  return str === '';
}
