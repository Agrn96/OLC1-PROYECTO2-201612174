import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { Datatype } from "../enums/EnumDatatype";
import { SymbolTable } from "../sym_table/SymbolTable";

export class DeclareArrayOne implements IStatement {
  constructor(
    private datatype: Datatype, //1
    private id: string, //2
    private size: IExpression | undefined, //3
    private list_expr: IExpression[] | undefined, //4
    public line: number, //5
    public column: number //6
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    console.log("size "+this.size)
    console.log(this.list_expr)
    let str: string = `node${this.uuid} [label="DeclareArray\\n ${this.id}"];\n`;
    console.log(this.id)
    if (this.size !== undefined && this.list_expr === undefined) {
      console.log("1")
      str += `node${this.uuid} -> node${this.size!.uuid};\n`;
      str += this.size!.graph();
    }

    if (this.list_expr !== undefined && this.size === undefined) {
      console.log("2")
      this.list_expr.forEach((expr) => {
        str += `node${this.uuid} -> node${expr.uuid};\n`;
        str += expr.graph();
      });
    }


    return str;
  }

  execute(sym_table: SymbolTable): void {
    console.log(this.size)
    if (this.list_expr !== undefined && this.size === undefined) {
      const size = this.list_expr.length;
      sym_table.createArray(
        this.id,
        size,
        this.datatype,
        this.line,
        this.column
      );
      this.list_expr.forEach((expr, index) => {
        const val = expr.evaluate(sym_table)!.value;
        sym_table.updateArraySymbol(this.id, index, val);
      });
    } else if (this.size !== undefined && this.list_expr === undefined) {
      const size = Number(this.size.evaluate(sym_table)!.value);
      sym_table.createArray(
        this.id,
        size,
        this.datatype,
        this.line,
        this.column
      );
    }else {
      const size = 20;
      console.log("size"+size)
      sym_table.createArray(
        this.id,
        size,
        this.datatype,
        this.line,
        this.column
      );
    }
  }
}
