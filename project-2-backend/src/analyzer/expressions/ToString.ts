import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";

import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class ToString implements IExpression {
  constructor(
    private expr: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="ToString"];\n`;
    str += `node${this.uuid} -> node${this.expr.uuid};\n`;
    str += this.expr.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    const eval_value = this.expr.evaluate(sym_table);

    if (
      eval_value!.type === Datatype.STRING ||
      eval_value!.type === Datatype.CHAR
    ) {
      throw new SemanticErrorEx(
        "The function toString expects a string or a boolean",
        this.line,
        this.column
      );
    } else {
      return {
        value: eval_value!.value.toString(),
        type: Datatype.STRING,
      };
    }
  }
}
