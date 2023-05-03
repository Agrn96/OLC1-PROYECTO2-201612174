import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Case implements IStatement {
  public constructor(
    public condition: IExpression,
    public body: IStatement[],
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Case"];\n`;
    str += `node${this.uuid} -> node${this.condition.uuid};\n`;
    str += this.condition.graph();
    this.body.forEach((statement) => {
      str += `node${this.uuid} -> node${statement.uuid};\n`;
      str += statement.graph();
    });
    return str;
  }

  public execute(sym_table: SymbolTable): void {
    this.body.forEach((statement) => statement.execute(sym_table));
  }
}
