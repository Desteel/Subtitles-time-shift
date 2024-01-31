import { memo } from 'react';
import { checkIsBreakString } from '../../helpers';
import './SubtitlesColumn.css';

type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  if (checkIsBreakString(text)) {
    return null;
  }
  return <span className="subtitlesText">{text}</span>;
}

type SubtitlesRowProps = {
  textLines: string[];
};

function SubtitlesRow({ textLines }: SubtitlesRowProps) {
  return (
    <p className="subtitlesRow">
      {textLines.map((line, lineIndex) => {
        return <Text key={lineIndex} text={line} />;
      })}
    </p>
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
        return <SubtitlesRow key={timestamp || index} textLines={textLines} />;
      })}
    </div>
  );
});
