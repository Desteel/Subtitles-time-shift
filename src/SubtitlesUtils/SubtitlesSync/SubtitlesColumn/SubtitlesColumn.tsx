import { memo } from 'react';
import { checkIsBreakString } from '../../helpers';
import './SubtitlesColumn.css';
import { Button } from 'components/Button';

type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  if (checkIsBreakString(text)) {
    return null;
  }
  return <span className="subtitlesText">{text}</span>;
}

function SubtitlesRow({ timestamp, textLines }: SubtitlesColumnProps['subtitles'][number]) {
  return (
    <div>
      <p className="subtitlesRow">
        <span className="subtitlesText">{timestamp}</span>

        {textLines.map((line, lineIndex) => {
          return <Text key={lineIndex} text={line} />;
        })}
      </p>
      {timestamp ? <Button onClick={() => {}}>Sync timestamp</Button> : null}
    </div>
  );
}

export type SubtitlesColumnProps = {
  subtitles: Array<{
    timestamp?: string;
    textLines: string[];
  }>;
};

export const SubtitlesColumn = memo(function SubtitlesColumn({ subtitles }: SubtitlesColumnProps) {
  return (
    <div className="gridColumn" style={{ gridRow: `auto / span ${subtitles.length}` }}>
      {subtitles.map(({ timestamp, textLines }, index) => {
        return <SubtitlesRow key={timestamp || index} timestamp={timestamp} textLines={textLines} />;
      })}
    </div>
  );
});
