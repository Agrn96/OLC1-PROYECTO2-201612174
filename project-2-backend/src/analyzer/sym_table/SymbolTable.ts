import { ICallable } from "../abstract/ICallable";
import { ISymArray } from "../abstract/ISymArray";
import { ISymMatrix } from "../abstract/ISymMatrix";
import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import fnParseArrayTypes from "../functions/fnParseArrayTypes";
import fnParseMatrixTypes from "../functions/fnParseMatrixTypes";
import { Global } from "./Global";

import { ISymbol } from "./ISymbol";

export class SymbolTable {
  public symbols: ISymbol[] = [];
  private console: string[] = [];
  private functions: ICallable[] = [];
  private arrays: ISymArray[] = [];
  private matrixes: ISymMatrix[] = [];

  public constructor(
    private parent: SymbolTable | undefined,
    public env: string
  ) {
    // console.log("[DEBUG]\t", `Creating Symbol Table: ${env}`);
    Global.tableList.push(this);
  }

  private debugTable(): void {
    // console.log("[DEBUG]\t", "Symbol Table:");
    // console.log("[TABLE]\t");
    this.symbols.forEach((symbol) => {
      // console.log("[TABLE]\t", symbol.id, symbol.value);
    });
  }

  private debugFunctions(): void {
    // console.log("[DEBUG]\t", "Functions:");
    // console.log("[FUNCTIONS]\t");
    this.functions.forEach((func) => {
      // console.log("[FUNCTIONS]\t", func.id);
    });
  }

  private debugArrays(): void {
    // console.log("[DEBUG]\t", "Arrays:");
    // console.log("[ARRAYS]\t");
    this.arrays.forEach((array) => {
      // console.log("[ARRAYS]\t", array.id);
    });
  }

  private debugMatrixes(): void {
    // console.log("[DEBUG]\t", "Matrixes:");
    // console.log("[MATRIXES]\t");
    this.matrixes.forEach((matrix) => {
      // console.log("[MATRIXES]\t", matrix.id);
    });
  }

  public addSymbol(symbol: ISymbol): void {
    // console.log("[DEBUG]\t", `Adding symbol ${symbol.id} = ${symbol.value}`);
    this.debugTable();
    if (this.symbols.find((s) => s.id === symbol.id) !== undefined) {
      throw new SemanticErrorEx(
        `Symbol ${symbol.id} already exists`,
        symbol.line,
        symbol.column
      );
    } else {
      this.symbols.push(symbol);
    }
    // console.log("[DEBUG]\t", `Symbol ${symbol.id} added`);
    this.debugTable();
  }

  public getSymbol(
    id: string,
    line: number,
    column: number
  ): ISymbol | undefined {
    const result = this.symbols.find((symbol) => symbol.id === id);

    if (result === undefined && this.parent !== undefined) {
      return this.parent.getSymbol(id, line, column);
    } else if (result === undefined) {
      throw new SemanticErrorEx(`Symbol ${id} not found`, line, column);
    } else {
      return result;
    }
  }

  public updateSymbol(
    id: string,
    value: string | boolean | number,
    line: number,
    column: number
  ): void {
    // console.log("[DEBUG]\t", `Updating symbol ${id} = ${value}`);
    this.debugTable();
    const symbol = this.getSymbol(id, line, column);

    if (symbol) {
      symbol.value = value;
    } else {
      throw new SemanticErrorEx(`Symbol ${id} not found`, undefined, undefined);
    }
    // console.log("[DEBUG]\t", `Symbol ${id} updated`);
    this.debugTable();
  }

  public addConsole(text: string): void {
    if (this.parent === undefined) {
      this.console.push(text);
    } else {
      this.parent.addConsole(text);
    }
  }

  public printConsole(): string {
    let result = "";
    this.console.forEach((text) => {
      // console.log("[CONSOLE]\t", text);
      result += text;
    });

    return result;
  }

  public addFunction(func: ICallable): void {
    // console.log("[DEBUG]\t", `Adding function ${func.id}`);
    this.debugFunctions();
    if (this.parent === undefined) {
      this.functions.push(func);
    } else {
      this.parent.addFunction(func);
    }
  }

  public getFunction(id: string): ICallable {
    if (this.parent === undefined) {
      return this.functions.find((func) => func.id === id)!;
    } else {
      return this.parent.getFunction(id);
    }
  }

  public getArraySymbol(id: string, pos: number): ISymbol {
    const array = this.getArray(id);

    if (pos < 0 || pos >= array.value.length) {
      throw new SemanticErrorEx(`Index out of bounds`, undefined, undefined);
    } else {
      return array.value[pos];
    }
  }

  public createArray(
    id: string,
    size: number,
    datatype: Datatype,
    line: number,
    column: number
  ): void {
    // console.log("[DEBUG]\t", `Creating array ${id}`);
    this.debugArrays();

    let val;

    switch (datatype) {
      case Datatype.CHAR:
      case Datatype.STRING:
        val = "";
        break;
      case Datatype.DOUBLE:
      case Datatype.INT:
        val = 0;
        break;
      case Datatype.BOOLEAN:
        val = false;
        break;
    }
    const array: Array<ISymbol> = [];
    for (let i = 0; i < size; i++) {
      array.push({
        id,
        value: val,
        datatype,
        column,
        line,
      });
    }
    this.arrays.push({
      id,
      value: array,
      type: fnParseArrayTypes(datatype),
      size,
    });

    // console.log("[DEBUG]\t", `Array ${id} created`);
    this.debugArrays();
  }

  private getArray(id: string): ISymArray {
    if (this.parent === undefined) {
      return this.arrays.find((array) => array.id === id)!;
    } else {
      return this.parent.getArray(id);
    }
  }

  public updateArraySymbol(
    id: string,
    pos: number,
    value: string | number | boolean
  ): void {
    const current: ISymbol = this.getArray(id).value[pos];
    current.value = value;
  }

  private getMatrix(id: string): ISymMatrix {
    if (this.parent === undefined) {
      return this.matrixes.find((matrix) => matrix.id === id)!;
    } else {
      return this.parent.getMatrix(id);
    }
  }

  public getMatrixSymbol(id: string, row: number, col: number): ISymbol {
    const matrix = this.getMatrix(id);
    if (row >= matrix.rows || col >= matrix.columns) {
      throw new SemanticErrorEx(
        `Matrix ${id} out of bounds`,
        undefined,
        undefined
      );
    } else {
      return matrix.value[row][col];
    }
  }

  public createMatrix(
    id: string,
    rows: number,
    cols: number,
    datatype: Datatype,
    line: number,
    column: number
  ): void {
    // console.log("[DEBUG]\t", `Creating matrix ${id}`);
    this.debugMatrixes();
    let val;

    switch (datatype) {
      case Datatype.CHAR:
      case Datatype.STRING:
        val = "";
        break;
      case Datatype.DOUBLE:
      case Datatype.INT:
        val = 0;
        break;
      case Datatype.BOOLEAN:
        val = false;
        break;
    }

    const matrix: Array<Array<ISymbol>> = [];
    for (let i = 0; i < rows; i++) {
      const row: Array<ISymbol> = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          id,
          value: val,
          datatype,
          column,
          line,
        });
      }
      matrix.push(row);
    }
    this.matrixes.push({
      id,
      value: matrix,
      type: fnParseMatrixTypes(datatype),
      rows,
      columns: cols,
    });
    // console.log("[DEBUG]\t", `Matrix ${id} created`);
    this.debugMatrixes();
  }

  public updateMatrixSymbol(
    id: string,
    row: number,
    col: number,
    value: string | number | boolean
  ): void {
    const current: ISymbol = this.getMatrix(id).value[row][col];
    current.value = value;
  }
}
