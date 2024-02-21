type ObjectValuesUnion<T extends Record<string, unknown>> = T[keyof T];

type ArrayWithMinLength<
  Item,
  MinLength extends number,
  Tuple extends Item[] = []
> = Tuple['length'] extends MinLength
  ? [...Tuple, ...Item[]]
  : ArrayWithMinLength<Item, MinLength, [...Tuple, Item]>;
