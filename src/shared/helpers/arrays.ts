export function getTailIndex<Item>(list: Item[]) {
  return list.length - 1;
}

export function getTail<Item>(list: Item[]) {
  const tailIndex = getTailIndex(list);

  return list[tailIndex];
}
