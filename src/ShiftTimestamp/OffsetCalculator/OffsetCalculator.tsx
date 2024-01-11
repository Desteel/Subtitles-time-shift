import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { timestampToMilliseconds, formatTimePartsToTimestamp } from '../utils';

const currentTimestampPlaceholder = formatTimePartsToTimestamp(0, 1, 2, 100);
const desiredTimestampPlaceholder = formatTimePartsToTimestamp(0, 1, 2, 200);

// TODO: Validation is required
export function OffsetCalculator() {
  const currentTimestampRef = useRef('');
  const desiredTimestampRef = useRef('');

  const [offset, setOffset] = useState(0);

  const calculateOffset = () => {
    const currentTimestampMilliseconds = timestampToMilliseconds(currentTimestampRef.current);
    const desiredTimestampMilliseconds = timestampToMilliseconds(desiredTimestampRef.current);

    setOffset(desiredTimestampMilliseconds - currentTimestampMilliseconds);
  };

  return (
    <div>
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

      <div>Offset value in milliseconds: {offset}</div>
    </div>
  );
}
