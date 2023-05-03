import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import fnSemanticCast from "../functions/fnSemanticCast";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Cast implements IExpression {
  constructor(
    private type: Datatype,
    private value: IExpression,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Cast"];\n`;

    str += `node${this.uuid} -> node${this.uuid}type;\n node${this.uuid}type[label="${this.type}"];\n`;

    str += `node${this.uuid} -> node${this.value.uuid};\n`;
    str += this.value.graph();
    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const expr = this.value.evaluate(sym_table);

    if (fnSemanticCast(expr!.type, this.type)) {
      switch (this.type) {
        case Datatype.INT:
          return {
            value: parseInt(expr!.value.toString()),
            type: Datatype.INT,
          };
        case Datatype.DOUBLE:
          return {
            value: parseFloat(expr!.value.toString()),
            type: Datatype.DOUBLE,
          };
        case Datatype.BOOLEAN:
          return {
            value: Boolean(expr!.value),
            type: Datatype.BOOLEAN,
          };
        case Datatype.CHAR:
          return {
            value: expr!.value.toString().charAt(0),
            type: Datatype.CHAR,
          };
        case Datatype.STRING:
          return {
            value: expr!.value.toString(),
            type: Datatype.STRING,
          };
      }
    } else {
      throw new SemanticErrorEx(
        `Cannot cast ${expr!.type} to ${this.type}`,
        this.line,
        this.column
      );
    }
  }
}
