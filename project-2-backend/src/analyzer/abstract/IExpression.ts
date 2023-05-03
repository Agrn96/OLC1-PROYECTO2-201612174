import { SymbolTable } from "../sym_table/SymbolTable";
import { IGraphical } from "./IGraphical";
import { IReturnEval } from "./IReturnEval";
import { ITabulable } from "./ITabulable";

export interface IExpression extends ITabulable, IGraphical {
  evaluate(sym_table: SymbolTable): IReturnEval | undefined;
}
