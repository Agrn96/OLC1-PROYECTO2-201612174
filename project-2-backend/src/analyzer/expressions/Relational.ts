import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { RelationalOp } from "../enums/EnumRelational";
import fnSemanticCompare from "../functions/fnSemanticCompare";
import fnSemanticRelational from "../functions/fnSemanticRelational";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Relational implements IExpression {
  constructor(
    private left: IExpression,
    private operator: RelationalOp,
    private right: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Relational"];\n`;

    str += `node${this.uuid} -> node${this.left.uuid};\n`;
    str += this.left.graph();

    str += `node${this.uuid} -> node${this.uuid}op;\n node${this.uuid}op[label="${this.operator}"];\n`;

    str += `node${this.uuid} -> node${this.right.uuid};\n`;
    str += this.right.graph();

    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const left = this.left.evaluate(sym_table);
    const right = this.right.evaluate(sym_table);

    switch (this.operator) {
      case RelationalOp.EQUAL:
      case RelationalOp.NOT_EQUAL:
        return fnSemanticCompare(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.operator,
          this.line,
          this.column
        );
      case RelationalOp.GREATER_THAN:
      case RelationalOp.GREATER_THAN_EQUAL:
      case RelationalOp.LESS_THAN:
      case RelationalOp.LESS_THAN_EQUAL:
        return fnSemanticRelational(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.operator,
          this.line,
          this.column
        );
    }
  }
}
