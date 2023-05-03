export class LexicalErrorEx extends Error {
  constructor(
    message: string,
    line: number | undefined,
    column: number | undefined
  ) {
    super(
      `[Lexical Error]: at line: ${line} and column: ${column}, message: ${message}`
    );
    this.name = "LexicalErrorEx";
  }
}
