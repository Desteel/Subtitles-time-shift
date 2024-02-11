import { ShiftTimestamp } from 'features/ShiftTimestamp';
import { SubtitlesSync } from 'features/SubtitlesSync';
import { Info } from '../Info';
import './SubtitlesTools.css';

export function SubtitlesTools() {
  return (
    <div>
      <Info />
      <ShiftTimestamp className="section" />
      <SubtitlesSync className="section" />
    </div>
  );
}
