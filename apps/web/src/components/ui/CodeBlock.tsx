interface CodeBlockProps {
  code: string;
  lineNumbers?: boolean;
}

/** Blocco codice monospace ≥14px con scroll orizzontale (highlighting pronto per fasi future). */
export function CodeBlock({ code, lineNumbers = false }: CodeBlockProps) {
  const lines = code.split('\n');
  return (
    <div className="code-window">
      <div className="code-window-bar" aria-hidden="true">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>Leggi. Ragiona. Comprendi.</span>
        <span className="code-window-tag">codice</span>
      </div>
      <pre tabIndex={0} aria-label="Codice dell’esempio">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="code-line">
              {lineNumbers && (
                <span className="line-number" aria-hidden="true">
                  {i + 1}
                </span>
              )}
              {line || '\u00a0'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
