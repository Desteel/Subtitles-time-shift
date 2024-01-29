import { useRef } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { timestampToMilliseconds, formatTimePartsToTimestamp } from '../utils';

const currentTimestampPlaceholder = formatTimePartsToTimestamp(0, 1, 2, 100);
const desiredTimestampPlaceholder = formatTimePartsToTimestamp(0, 1, 2, 200);

export type OffsetCalculatorProps = {
  calculatedOffset: number;
  onCalculateOffset: (calculatedOffset: number) => void;
} & Partial<{
  className: string;
}>;

// TODO: Validation is required
export function OffsetCalculator({ calculatedOffset, onCalculateOffset, className }: OffsetCalculatorProps) {
  const currentTimestampRef = useRef('');
  const desiredTimestampRef = useRef('');

  const calculateOffset = () => {
    const currentTimestampMilliseconds = timestampToMilliseconds(currentTimestampRef.current);
    const desiredTimestampMilliseconds = timestampToMilliseconds(desiredTimestampRef.current);

    onCalculateOffset(desiredTimestampMilliseconds - currentTimestampMilliseconds);
  };

  return (
    <div className={className}>
      <Input
        name="currentTimestamp"
        label="Enter current timestamp"
        placeholder={currentTimestampPlaceholder}
        type="string"
        onChange={(event) => (currentTimestampRef.current = event.target.value)}
        defaultValue={currentTimestampRef.current}
      />
      <Input
        name="desiredTimestamp"
        label="Enter desired timestamp"
        placeholder={desiredTimestampPlaceholder}
        type="string"
        onChange={(event) => (desiredTimestampRef.current = event.target.value)}
        defaultValue={desiredTimestampRef.current}
      />

      <Button onClick={calculateOffset}>Calculate offset</Button>

      <div>Calculated offset (milliseconds): {calculatedOffset}</div>
    </div>
  );
}
