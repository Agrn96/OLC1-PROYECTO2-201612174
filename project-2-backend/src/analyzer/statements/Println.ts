import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Println implements IStatement {
  constructor(
    private text: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Println"];\n`;
    str += `node${this.uuid} -> node${this.text.uuid};\n`;
    str += this.text.graph();
    return str;
  }

  execute(sym_table: SymbolTable): void {
    const eval_value = this.text.evaluate(sym_table);
    sym_table.addConsole(eval_value!.value.toString() + "\n");
  }
}
