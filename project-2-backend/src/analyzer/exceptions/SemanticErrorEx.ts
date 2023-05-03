export class SemanticErrorEx extends Error {
  constructor(
    message: string,
    line: number | undefined,
    column: number | undefined
  ) {
    super(
      `[Semantic Error]: at line: ${line} and column: ${column}, message: ${message}`
    );
    this.name = "SemanticErrorEx";
  }
}
