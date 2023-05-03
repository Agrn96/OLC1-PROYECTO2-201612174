import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { ArithmeticOp } from "../enums/EnumArithmetic";
import fnSemanticAdd from "../functions/fnSemanticAdd";
import fnSemanticDivision from "../functions/fnSemanticDivision";
import fnSemanticMinus from "../functions/fnSemanticMinus";
import fnSemanticModule from "../functions/fnSemanticModule";
import fnSemanticPower from "../functions/fnSemanticPower";
import fnSemanticProduct from "../functions/fnSemanticProduct";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Arithmetic implements IExpression {
  constructor(
    private left: IExpression,
    private operator: ArithmeticOp,
    private right: IExpression,
    public line: number,
    public column: number
  ) {}
  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Arithmetic"];\n`;

    str += `node${this.uuid} -> node${this.left.uuid};\n`;
    str += this.left.graph();

    str += `node${this.uuid} -> node${this.uuid}op;\n node${this.uuid}op[label="${this.operator}"];\n`;

    str += `node${this.uuid} -> node${this.right.uuid};\n`;
    str += this.right.graph();

    return str;
  }

  evaluate(sym_table: SymbolTable): IReturnEval {
    const left = this.left.evaluate(sym_table);
    const right = this.right.evaluate(sym_table);

    switch (this.operator) {
      case ArithmeticOp.ADD:
        return fnSemanticAdd(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
      case ArithmeticOp.MINUS:
        return fnSemanticMinus(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
      case ArithmeticOp.PRODUCT:
        return fnSemanticProduct(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
      case ArithmeticOp.DIVISION:
        return fnSemanticDivision(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
      case ArithmeticOp.POWER:
        return fnSemanticPower(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
      case ArithmeticOp.MODULE:
        return fnSemanticModule(
          left!.type,
          right!.type,
          left!.value,
          right!.value,
          this.line,
          this.column
        );
    }
  }
}
