import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { IStatement } from "../abstract/IStatement";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Declaration implements IStatement {
  constructor(
    private type: Datatype,
    private ids: string[],
    private value: IExpression | undefined = undefined,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Declaration"];\n`;
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
    let eval_value: IReturnEval | undefined;

    if (this.value !== undefined) {
      eval_value = this.value.evaluate(sym_table);
    } else {
      switch (this.type) {
        case Datatype.CHAR:
        case Datatype.STRING:
          eval_value = { value: "", type: this.type };
          break;
        case Datatype.DOUBLE:
        case Datatype.INT:
          eval_value = { value: 0, type: this.type };
          break;
        case Datatype.BOOLEAN:
          eval_value = { value: false, type: this.type };
          break;
      }
    }

    if (this.type === eval_value!.type) {
      this.ids.forEach((id) => {
        sym_table.addSymbol({
          id,
          datatype: this.type,
          line: this.line,
          column: this.column,
          value: eval_value!.value,
        });
      });
    } else {
      throw new SemanticErrorEx("Type mismatch", this.line, this.column);
    }
  }
}
