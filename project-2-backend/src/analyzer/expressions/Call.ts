import { Guid } from "typescript-guid";
import { IExpression } from "../abstract/IExpression";
import { IReturnEval } from "../abstract/IReturnEval";
import { IStatement } from "../abstract/IStatement";
import { ReturnEx } from "../exceptions/ReturnEx";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import { SymbolTable } from "../sym_table/SymbolTable";

export class Call implements IExpression, IStatement {
  constructor(
    private id: string,
    private args: IExpression[] | undefined,
    public line: number,
    public column: number
  ) {}

  uuid: string = Guid.create().toString().replace(/-/gm, ""); // Unique identifier
  graph(): string {
    let str: string = `node${this.uuid} [label="Call"];\n`;
    str += `node${this.uuid} -> node${this.uuid}id;\n node${this.uuid}id[label="${this.id}"];\n`;
    if (this.args !== undefined) {
      this.args.forEach((arg) => {
        str += `node${this.uuid} -> node${arg.uuid};\n`;
        str += arg.graph();
      });
    }
    return str;
  }

  execute(sym_table: SymbolTable): void {
    const func = sym_table.getFunction(this.id);

    if (func === undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} not found`,
        this.line,
        this.column
      );
    }

    if (func.params !== undefined && this.args !== undefined) {
      if (func.params.length !== this.args!.length) {
        throw new SemanticErrorEx(
          `Function ${this.id} expects ${func.params.length} arguments`,
          this.line,
          this.column
        );
      }
    } else if (func.params !== undefined && this.args === undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} expects ${func.params.length} arguments`,
        this.line,
        this.column
      );
    } else if (func.params === undefined && this.args !== undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} expects 0 arguments`,
        this.line,
        this.column
      );
    }

    try {
      const func_table = new SymbolTable(sym_table, "call function " + this.id);

      if (this.args !== undefined) {
        this.args.forEach((arg, index) => {
          const value = arg.evaluate(sym_table);
          func_table.addSymbol({
            column: this.column,
            datatype: func!.params![index].datatype,
            id: func!.params![index].id,
            line: this.line,
            value: value!.value,
          });
        });
      }

      func!.body.forEach((statement) => {
        statement.execute(func_table);
      });
    } catch (error) {
      if (error instanceof ReturnEx) {
        return;
      } else {
        throw error;
      }
    }
  }

  evaluate(sym_table: SymbolTable): IReturnEval | undefined {
    const func = sym_table.getFunction(this.id);

    if (func === undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} not found`,
        this.line,
        this.column
      );
    }

    if (func.params !== undefined && this.args !== undefined) {
      if (func.params.length !== this.args!.length) {
        throw new SemanticErrorEx(
          `Function ${this.id} expects ${func.params.length} arguments`,
          this.line,
          this.column
        );
      }
    } else if (func.params !== undefined && this.args === undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} expects ${func.params.length} arguments`,
        this.line,
        this.column
      );
    } else if (func.params === undefined && this.args !== undefined) {
      throw new SemanticErrorEx(
        `Function ${this.id} expects 0 arguments`,
        this.line,
        this.column
      );
    }

    try {
      const func_table = new SymbolTable(sym_table, "call function " + this.id);

      if (this.args !== undefined) {
        this.args.forEach((arg, index) => {
          const value = arg.evaluate(sym_table);
          func_table.addSymbol({
            column: this.column,
            datatype: func!.params![index].datatype,
            id: func!.params![index].id,
            line: this.line,
            value: value!.value,
          });
        });
      }

      func!.body.forEach((statement) => {
        statement.execute(func_table);
      });
    } catch (error) {
      if (error instanceof ReturnEx) {
        if (error.value === undefined) {
          throw new SemanticErrorEx(
            `Function ${this.id} must return a value`,
            this.line,
            this.column
          );
        }
        if (error.value.type === func!.datatype) {
          return error.value;
        }
        throw new SemanticErrorEx(
          `Function ${this.id} expects return type ${func!.datatype}`,
          this.line,
          this.column
        );
      } else {
        throw error;
      }
    }
  }
}
