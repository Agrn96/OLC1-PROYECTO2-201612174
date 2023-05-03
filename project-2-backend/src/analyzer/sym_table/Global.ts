import { IRenderSymbol } from "../abstract/IRenderSymbol";
import { SymbolTable } from "./SymbolTable";

export class Global {
  public static tableList: SymbolTable[] = [];

  public static getTable(): IRenderSymbol[] {
    const symbols: IRenderSymbol[] = [];

    this.tableList.forEach((element) => {
      element.symbols.forEach((symbol) => {
        symbols.push({
          id: symbol.id,
          datatype: symbol.datatype,
          line: symbol.line,
          column: symbol.column,
          env: element.env,
          value: symbol.value,
        });
      });
    });

    return symbols;
  }

  public static clearTable() {
    this.tableList.splice(0, this.tableList.length);
  }
}
