import type { Question } from '@lg/core';
import { CodeBlock } from '../ui/CodeBlock';
import { Icon } from '../ui/Icon';
import { RichText } from '../ui/RichText';

interface QuestionHeaderProps {
  question: Question;
  typeLabel: string;
}

export function QuestionHeader({ question, typeLabel }: QuestionHeaderProps) {
  return (
    <>
      <div className="question-meta">
        <span className="question-type">
          <Icon name="code" size={16} />
          {typeLabel}
        </span>
        <span className="difficulty-label">
          {{ easy: 'Fondamenti', medium: 'Un passo in più', hard: 'Sfida' }[question.difficulty]}
        </span>
      </div>
      <h2>
        <RichText text={question.prompt} />
      </h2>
      {question.code && <CodeBlock code={question.code} lineNumbers />}
    </>
  );
}
