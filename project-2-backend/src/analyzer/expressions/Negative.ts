import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Negative implements IExpression {
  constructor(
    private expression: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Negative"];\n`;
    str += `node${this.uuid} -> node${this.expression.uuid};\n`;
    str += this.expression.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const result = this.expression.evaluate(sym_table);

    if (result!.type !== Datatype.DOUBLE && result!.type !== Datatype.INT) {
      throw new SemanticErrorEx(
        "Negative operator only works with number values",
        this.line,
        this.column
      );
    }

    return { type: result!.type, value: -Number(result!.value) };
  }
}
