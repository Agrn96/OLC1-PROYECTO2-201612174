import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { BreakLoopEx } from "../exceptions/BreakLoopEx";
import { ContinueLoopEx } from "../exceptions/ContinueLoopEx";
import { Decrement } from "../expressions/Decrement";
import { Increment } from "../expressions/Increment";
import { SymbolTable } from "../sym_table/SymbolTable";
import { Assign } from "./Assign";
import { Declaration } from "./Declaration";

export class For implements IStatement {
  constructor(
    private init: Declaration | Assign,
    private condition: IExpression,
    private increment: Increment | Decrement | Assign,
    private body: IStatement[],
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="For"];\n`;
    str += `node${this.uuid} -> node${this.init.uuid};\n`;
    str += this.init.graph();
    str += `node${this.uuid} -> node${this.condition.uuid};\n`;
    str += this.condition.graph();
    str += `node${this.uuid} -> node${this.increment.uuid};\n`;
    str += this.increment.graph();
    this.body.forEach((statement) => {
      str += `node${this.uuid} -> node${statement.uuid};\n`;
      str += statement.graph();
    });
    return str;
  }

  execute(sym_table: SymbolTable): void {
    const for_table = new SymbolTable(sym_table, "for");
    this.init.execute(for_table);
    while (Boolean(this.condition.evaluate(for_table)!.value)) {
      try {
        const internal_table = new SymbolTable(for_table, "internal for");
        this.body.forEach((statement) => statement.execute(internal_table));

        if (
          this.increment instanceof Increment ||
          this.increment instanceof Decrement
        ) {
          const eval_value = this.increment.evaluate(for_table);
          for_table.updateSymbol(
            this.increment.identifier,
            eval_value.value,
            this.line,
            this.column
          );
        } else {
          this.increment.execute(for_table);
        }
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
