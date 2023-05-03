import { Guid } from "typescript-guid";
import { IStatement } from "../abstract/IStatement";
import { BreakLoopEx } from "../exceptions/BreakLoopEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class BreakLoop implements IStatement {
  constructor(public line: number, public column: number) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    return `node${this.uuid} [label="BreakLoop"];\n`;
  }

  execute(table: SymbolTable): void {
    throw new BreakLoopEx();
  }
}
