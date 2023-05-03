import { IStatement } from "../abstract/IStatement";
import { IParam } from "../abstract/IParam";
import { SymbolTable } from "../sym_table/SymbolTable";
import { ICallable } from "../abstract/ICallable";
import { Datatype } from "../enums/EnumDatatype";
import { Guid } from "typescript-guid";

export class Method implements ICallable {
  datatype: Datatype | undefined = undefined; 
  constructor(
    public id: string, //1
    public params: IParam[] | undefined, //2
    public body: IStatement[], //3
    public line: number, //4
    public column: number//5
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Method"];\n`;
    str += `node${this.uuid} ->  node${this.uuid}id;\n node${this.uuid}id[label="${this.id}"];\n`;
    
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
