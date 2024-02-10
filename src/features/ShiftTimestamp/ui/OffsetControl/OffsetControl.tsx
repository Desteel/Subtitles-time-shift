import { useRef, ChangeEventHandler } from 'react';
import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';

export type OffsetControlProps = {
  onApplyOffsetClick: (offset: number) => void;
} & Partial<{
  initialOffset: number;
}>;

export function OffsetControl({ initialOffset = 0, onApplyOffsetClick }: OffsetControlProps) {
  const offsetRef = useRef(initialOffset);

  const setOffset: ChangeEventHandler<HTMLInputElement> = (event) => {
    const offset = Number(event.target.value);
    if (!Number.isNaN(offset)) {
      offsetRef.current = offset;
    }
  };

  const handleApplyOffsetClick = () => {
    onApplyOffsetClick(offsetRef.current);
  };

  const getInputDefaultValue = () => {
    const { current } = offsetRef;
    return current !== 0 ? current : undefined;
  };

  return (
    <div>
      <Input
        name="offsetControl"
        label="Enter offset in milliseconds"
        placeholder="0"
        type="number"
        onChange={setOffset}
        defaultValue={getInputDefaultValue()}
      />
      <Button onClick={handleApplyOffsetClick}>Apply offset</Button>
    </div>
  );
}
