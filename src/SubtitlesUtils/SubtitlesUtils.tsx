import { Info } from './Info';
import { ShiftTimestamp } from './ShiftTimestamp';
import './SubtitlesUtils.css';

export function SubtitlesUtils() {
  return (
    <div>
      <Info />
      <ShiftTimestamp className="section" />
    </div>
  );
}
