import { SymbolTable } from "../sym_table/SymbolTable";
import { IGraphical } from "./IGraphical";
import { ITabulable } from "./ITabulable";

export interface IStatement extends ITabulable, IGraphical {
  execute(sym_table: SymbolTable): void;
}
