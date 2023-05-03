import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class AccessMatrix implements IExpression {
  constructor(
    private id: string,
    private row: IExpression,
    private col: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="AccessMatrix"];\n`;

    str += `node${this.uuid} -> node${this.uuid}id;\n node${this.uuid}id[label="${this.id}"];\n`;

    str += `node${this.uuid} -> node${this.row.uuid};\n`;
    str += this.row.graph();

    str += `node${this.uuid} -> node${this.col.uuid};\n`;
    str += this.col.graph();

    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    if (this.row.evaluate(sym_table)!.value < 0) {
      throw new SemanticErrorEx("Index out of bounds", this.line, this.column);
    } else {
      const result = sym_table.getMatrixSymbol(
        this.id,
        Number(this.row.evaluate(sym_table)!.value),
        Number(this.col.evaluate(sym_table)!.value)
      );

      return {
        value: result.value,
        type: result.datatype,
      };
    }
  }
}
