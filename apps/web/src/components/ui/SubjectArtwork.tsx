import type { SubjectDefinition } from '@lg/core';
import type { CSSProperties } from 'react';
import { Icon } from './Icon';

export function subjectStyle(subject: SubjectDefinition): CSSProperties {
  return {
    '--course-color': subject.theme.primary,
    '--course-soft': subject.theme.secondary,
  } as CSSProperties;
}

export function SubjectArtwork({
  subject,
  compact = false,
}: {
  subject: SubjectDefinition;
  compact?: boolean;
}) {
  return (
    <div
      className={`subject-art ${compact ? 'subject-art--compact' : ''}`}
      style={subjectStyle(subject)}
      aria-hidden="true"
    >
      <div className="art-orbit art-orbit--one" />
      <div className="art-orbit art-orbit--two" />
      <div className="art-platform" />
      <div className="art-tile">
        <span>{subject.icon}</span>
        <span className="art-tile-caption">{subject.name}</span>
      </div>
      <div className="art-chip art-chip--code">
        <Icon name="code" size={22} />
        <span>apprendi()</span>
      </div>
      <div className="art-chip art-chip--check">
        <Icon name="check" size={18} />
        <span>Un concetto alla volta</span>
      </div>
      <span className="art-spark art-spark--one">
        <Icon name="spark" size={29} />
      </span>
      <span className="art-spark art-spark--two">
        <Icon name="spark" size={17} />
      </span>
      <span className="art-dot" />
    </div>
  );
}
