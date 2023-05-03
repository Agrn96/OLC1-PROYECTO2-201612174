import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Round implements IExpression {
  constructor(
    private value: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Round"];\n`;
    str += `node${this.uuid} -> node${this.value.uuid};\n`;
    str += this.value.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    const eval_value = this.value.evaluate(sym_table);

    if (
      eval_value!.type === Datatype.DOUBLE ||
      eval_value!.type === Datatype.INT
    ) {
      return {
        value: Math.round(Number(eval_value!.value)),
        type: Datatype.INT,
      };
    }
  }
}
