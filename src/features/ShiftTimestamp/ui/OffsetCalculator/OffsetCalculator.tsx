import { useRef, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';
import { SRTTimestamp, checkIsSRTTimeStampRange } from 'shared/kernel/subtitles';
import { timestampToMilliseconds } from '../../core/domain/srt';

// TODO: Add different extensions support
const CURRENT_TIMESTAMP_PLACEHOLDER: SRTTimestamp = '00:02:14,0000';
const DESIRED_TIMESTAMP_PLACEHOLDER: SRTTimestamp = '00:02:15,0000';

export type OffsetCalculatorProps = {
  calculatedOffset: number;
  onCalculateOffset: (calculatedOffset: number) => void;
} & Partial<{
  className: string;
}>;

function calculateOffset(currentTimestamp: SRTTimestamp, desiredTimestamp: SRTTimestamp): number {
  const currentTimestampMilliseconds = timestampToMilliseconds(currentTimestamp);
  const desiredTimestampMilliseconds = timestampToMilliseconds(desiredTimestamp);

  return desiredTimestampMilliseconds - currentTimestampMilliseconds;
}

export function OffsetCalculator({ calculatedOffset, onCalculateOffset, className }: OffsetCalculatorProps) {
  const currentTimestampRef = useRef('');
  const desiredTimestampRef = useRef('');

  const [error, setError] = useState<string>();

  const handleCalculateClick = () => {
    const currentTimestamp = currentTimestampRef.current;
    const desiredTimestamp = desiredTimestampRef.current;

    if (checkIsSRTTimeStampRange(currentTimestamp) && checkIsSRTTimeStampRange(desiredTimestamp)) {
      onCalculateOffset(calculateOffset(currentTimestamp, desiredTimestamp));
    } else {
      setError('Invalid timestamp');
    }
  };

  return (
    <div className={className}>
      <Input
        name="currentTimestamp"
        label="Enter current timestamp"
        placeholder={CURRENT_TIMESTAMP_PLACEHOLDER}
        type="string"
        onChange={(event) => (currentTimestampRef.current = event.target.value)}
        defaultValue={currentTimestampRef.current}
      />
      <Input
        name="desiredTimestamp"
        label="Enter desired timestamp"
        placeholder={DESIRED_TIMESTAMP_PLACEHOLDER}
        type="string"
        onChange={(event) => (desiredTimestampRef.current = event.target.value)}
        defaultValue={desiredTimestampRef.current}
      />

      <Button onClick={handleCalculateClick}>Calculate offset</Button>

      <div>{error}</div>

      <div>Calculated offset (milliseconds): {calculatedOffset}</div>
    </div>
  );
}
