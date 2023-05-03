import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IStatement } from "../abstract/IStatement";
import { Datatype } from "../enums/EnumDatatype";
import { SymbolTable } from "../sym_table/SymbolTable";

export class DeclareArrayTwo implements IStatement {
  constructor(
    private datatype: Datatype,
    private id: string,
    private list_expr: Array<Array<IExpression>> | undefined,
    private row: IExpression | undefined,
    private col: IExpression | undefined,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="DeclareArrayTwo"];\n`;
    if (this.row !== undefined) {
      str += `node${this.uuid} -> node${this.row!.uuid};\n`; // TODO: Check this
      str += this.row!.graph(); // TODO: Check this
    }
    if (this.col !== undefined) {
      str += `node${this.uuid} -> node${this.col!.uuid};\n`; // TODO: Check this
      str += this.col!.graph(); // TODO: Check this
    }

    if (this.list_expr !== undefined) {
      this.list_expr.forEach((list) => {
        list.forEach((expr) => {
          str += `node${this.uuid} -> node${expr.uuid};\n`;
          str += expr.graph();
        });
      });
    }

    return str;
  }

  execute(sym_table: SymbolTable): void {
    if (this.list_expr !== undefined) {
      const row = this.list_expr.length;
      const col = this.list_expr[0].length;
      sym_table.createMatrix(
        this.id,
        row,
        col,
        this.datatype,
        this.line,
        this.column
      );
      this.list_expr.forEach((list, index) => {
        list.forEach((expr, index2) => {
          const val = expr.evaluate(sym_table)!.value;
          sym_table.updateMatrixSymbol(this.id, index, index2, val);
        });
      });
    } else if (this.row !== undefined && this.col !== undefined) {
      const row = Number(this.row.evaluate(sym_table)!.value);
      const col = Number(this.col.evaluate(sym_table)!.value);
      sym_table.createMatrix(
        this.id,
        row,
        col,
        this.datatype,
        this.line,
        this.column
      );
    }
  }
}
