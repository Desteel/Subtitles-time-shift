import { Info } from './Info';
import { ShiftTimestamp } from './ShiftTimestamp';
import { SubtitlesSync } from './SubtitlesSync';
import './SubtitlesUtils.css';

export function SubtitlesUtils() {
  return (
    <div>
      <Info />
      <ShiftTimestamp className="section" />
      <SubtitlesSync className="section" />
    </div>
  );
}
