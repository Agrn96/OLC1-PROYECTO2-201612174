import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { LogicalOp } from "../enums/EnumLogical";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Logical implements IExpression {
  constructor(
    private left: IExpression,
    private operator: LogicalOp,
    private right: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Logical"];\n`;
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

    if (left!.type !== Datatype.BOOLEAN || right!.type !== Datatype.BOOLEAN) {
      throw new SemanticErrorEx(
        "Logical operator only works with boolean values",
        this.line,
        this.column
      );
    }

    switch (this.operator) {
      case LogicalOp.AND:
        return {
          type: Datatype.BOOLEAN,
          value: Boolean(left!.value) && Boolean(right!.value),
        };
      case LogicalOp.OR:
        return {
          type: Datatype.BOOLEAN,
          value: Boolean(left!.value) || Boolean(right!.value),
        };
    }
  }
}
