import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Ternary implements IExpression {
  constructor(
    private condition: IExpression,
    private trueExpression: IExpression,
    private falseExpression: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Ternary"];\n`;
    str += `node${this.uuid} -> node${this.condition.uuid};\n`;
    str += `node${this.uuid} -> node${this.trueExpression.uuid};\n`;
    str += `node${this.uuid} -> node${this.falseExpression.uuid};\n`;
    str += this.condition.graph();
    str += this.trueExpression.graph();
    str += this.falseExpression.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const condition = this.condition.evaluate(sym_table);
    if (condition!.type !== Datatype.BOOLEAN) {
      throw new SemanticErrorEx(
        "Ternary condition! must be boolean",
        this.line,
        this.column
      );
    }

    if (condition!.value) {
      return this.trueExpression.evaluate(sym_table)!;
    } else {
      return this.falseExpression.evaluate(sym_table)!;
    }
  }
}
