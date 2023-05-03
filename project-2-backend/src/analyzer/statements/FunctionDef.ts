import { ICallable } from "../abstract/ICallable";
import { IStatement } from "../abstract/IStatement";
import { Datatype } from "../enums/EnumDatatype";
import { IParam } from "../abstract/IParam";
import { SymbolTable } from "../sym_table/SymbolTable";
import { Guid } from "typescript-guid";

export class FunctionDef implements ICallable {
  constructor(
    public id: string,//1
    public params: IParam[] | undefined,//2
    public datatype: Datatype, //3
    public body: IStatement[], //4
    public line: number, //5
    public column: number //6
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="FunctionDef"];\n`;
    str += `node${this.uuid} -> node${this.uuid}id;\n node${this.uuid}id[label="${this.id}"];\n`;

    this.body.forEach((statement) => {
      str += `node${this.uuid} -> node${statement.uuid};\n`;
      str += statement.graph();
    });
    return str;
  }

  execute(sym_table: SymbolTable): void {
    sym_table.addFunction(this);
  }
}
