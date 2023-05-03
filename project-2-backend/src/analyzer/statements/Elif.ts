import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { Datatype } from "../enums/EnumDatatype";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Elif implements IStatement {
  constructor(
    public condition: IExpression,
    private body: IStatement[],
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Elif"];\n`;
    str += `node${this.uuid} -> node${this.condition.uuid};\n`;
    str += this.condition.graph();
    this.body.forEach((statement) => {
      str += `node${this.uuid} -> node${statement.uuid};\n`;
      str += statement.graph();
    });
    return str;
  }

  execute(sym_table: SymbolTable): void {
    this.body.forEach((statement) => {
      statement.execute(sym_table);
    });
  }
}
