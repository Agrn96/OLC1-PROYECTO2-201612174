import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Assign implements IStatement {
  constructor(
    private ids: string[],
    private value: IExpression | undefined = undefined,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Assign"];\n`;
    this.ids.forEach((id, i) => {
      str += `node${this.uuid} -> node${this.uuid}${i};\n node${this.uuid}${i}[label="${id}"];\n`;
    });
    if (this.value !== undefined) {
      str += `node${this.uuid} -> node${this.value!.uuid};\n`;
      str += this.value!.graph();
    }
    return str;
  }

  execute(sym_table: SymbolTable): void {
    const eval_value = this.value!.evaluate(sym_table);

    this.ids.forEach((id) => {
      const symbol = sym_table.getSymbol(id, this.line, this.column);

      if (symbol!.datatype === eval_value!.type) {
        sym_table.updateSymbol(id, eval_value!.value, this.line, this.column);
      } else {
        throw new SemanticErrorEx("Type mismatch", this.line, this.column);
      }
    });
  }
}
