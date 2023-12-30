import { useRef, ChangeEventHandler } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { minutesToMs } from '../utils';

export type OffsetControlProps = {
  onApplyOffsetClick: (offset: number) => void;
} & Partial<{
  initialOffset: number;
}>;

function offsetToMs(offset: string | number) {
  const [minutes, seconds] = String(offset).split('.');

  return minutesToMs(minutes) + Number(seconds || 0);
}

export function OffsetControl({ initialOffset = 0, onApplyOffsetClick }: OffsetControlProps) {
  const offsetRef = useRef(initialOffset);

  const setOffset: ChangeEventHandler<HTMLInputElement> = (event) => {
    const offset = Number(event.target.value);
    if (!Number.isNaN(offset)) {
      offsetRef.current = offsetToMs(offset);
    }
  };

  const handleApplyOffsetClick = () => {
    onApplyOffsetClick(offsetRef.current);
  };

  const getInputDefaultValue = () => {
    const { current } = offsetRef;
    return current > 0 ? current : undefined;
  };

  return (
    <div>
      <Input
        name="offsetControl"
        label='Enter offset in format "seconds.milliseconds"'
        placeholder="0.00"
        type="number"
        onChange={setOffset}
        defaultValue={getInputDefaultValue()}
      />
      <Button onClick={handleApplyOffsetClick}>Apply offset</Button>
    </div>
  );
}
