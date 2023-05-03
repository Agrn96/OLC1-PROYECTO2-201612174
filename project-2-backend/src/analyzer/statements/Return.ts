import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { ReturnEx } from "../exceptions/ReturnEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Return implements IStatement {
  constructor(
    private expression: IExpression | undefined,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Return"];\n`;
    if (this.expression !== undefined) {
      str += `node${this.uuid} -> node${this.expression.uuid};\n`;
      str += this.expression.graph();
    }
    return str;
  }

  execute(sym_table: SymbolTable): void {
    if (this.expression !== undefined) {
      const value = this.expression.evaluate(sym_table);
      throw new ReturnEx(value);
    } else {
      throw new ReturnEx(undefined);
    }
  }
}
