export function hasKeyIn<Key extends string>(obj: Record<Key, unknown>, key: string): key is Key {
  return key in obj;
}
