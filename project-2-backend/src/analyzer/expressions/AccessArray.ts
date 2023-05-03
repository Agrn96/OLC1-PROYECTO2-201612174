import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class AccessArray implements IExpression {
  constructor(
    private id: string,
    private index: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="AccessArray"];\n`;

    str += `node${this.uuid} -> node${this.uuid}id;\n node${this.uuid}id[label="${this.id}"];\n`;

    str += `node${this.uuid} -> node${this.index.uuid};\n`;
    str += this.index.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    const eval_value = this.index.evaluate(sym_table);
    if (eval_value!.value < 0) {
      throw new SemanticErrorEx("Index out of bounds", this.line, this.column);
    } else {
      const result = sym_table.getArraySymbol(
        this.id,
        Number(eval_value!.value)
      );

      return {
        value: result.value,
        type: result.datatype,
      };
    }
  }
}
