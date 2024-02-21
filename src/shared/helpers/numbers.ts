export function getClosestNumber(values: ArrayWithMinLength<number, 2>, targetValue: number): number {
  let closestValue = values[0];
  let minDistance = Math.abs(targetValue - closestValue);

  const { length } = values;

  for (let i = 1; i < length; i++) {
    const currentValue = values[i];
    const distance = Math.abs(targetValue - currentValue);

    if (distance < minDistance) {
      closestValue = currentValue;
      minDistance = distance;
    }
  }

  return closestValue;
}
