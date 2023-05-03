export class SyntaxErrorEx extends Error {
  constructor(
    message: string,
    line: number | undefined,
    column: number | undefined
  ) {
    super(
      `[Syntax Error]: at line: ${line} and column: ${column}, message: ${message}`
    );
    this.name = "SyntaxErrorEx";
  }
}
