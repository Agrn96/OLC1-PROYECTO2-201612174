import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { BreakLoopEx } from "../exceptions/BreakLoopEx";
import { ContinueLoopEx } from "../exceptions/ContinueLoopEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class While implements IStatement {
  constructor(
    private condition: IExpression,
    private body: IStatement[],
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="While"];\n`;
    str += `node${this.uuid} -> node${this.condition.uuid};\n`;
    str += this.condition.graph();
    this.body.forEach((statement) => {
      str += `node${this.uuid} -> node${statement.uuid};\n`;
      str += statement.graph();
    });
    return str;
  }

  execute(sym_table: SymbolTable): void {
    while (Boolean(this.condition.evaluate(sym_table)?.value)) {
      try {
        const while_table: SymbolTable = new SymbolTable(sym_table, "while");
        this.body.forEach((statement) => {
          statement.execute(while_table);
        });
      } catch (error: unknown) {
        if (error instanceof ContinueLoopEx) {
          continue;
        } else if (error instanceof BreakLoopEx) {
          break;
        } else {
          throw error;
        }
      }
    }
  }
}
