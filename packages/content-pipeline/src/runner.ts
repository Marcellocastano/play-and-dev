/**
 * Executes code in a subject's language. `run` returns what the program prints
 * (one line per output statement; on error, the error name). `evalExpr` returns the
 * printed value of a single expression, or null when it cannot be evaluated
 * (syntax error, unknown identifier): used to verify "executable" match/true-false items.
 */
export interface CodeRunner {
  lang: string;
  run(code: string): Promise<string>;
  evalExpr?(expr: string): Promise<string | null>;
}
