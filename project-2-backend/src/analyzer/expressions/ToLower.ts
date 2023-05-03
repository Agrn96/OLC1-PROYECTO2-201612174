import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class ToLower implements IExpression {
  constructor(
    private value: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="ToLower"];\n`;
    str += `node${this.uuid} -> node${this.value.uuid};\n`;
    str += this.value.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    const eval_value = this.value.evaluate(sym_table);
    if (eval_value!.type === Datatype.STRING) {
      return {
        value: eval_value!.value.toString().toLowerCase(),
        type: Datatype.STRING,
      };
    } else {
      throw new SemanticErrorEx(
        "Cannot convert to lower case a non string value",
        this.line,
        this.column
      );
    }
  }
}
