import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Not implements IExpression {
  constructor(
    private expression: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Not"];\n`;
    str += `node${this.uuid} -> node${this.expression.uuid};\n`;
    str += this.expression.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const expr = this.expression.evaluate(sym_table);

    if (expr!.type !== Datatype.BOOLEAN) {
      throw new SemanticErrorEx(
        "Logical operator only works with boolean values",
        this.line,
        this.column
      );
    }

    return { type: Datatype.BOOLEAN, value: !Boolean(expr!.value) };
  }
}
