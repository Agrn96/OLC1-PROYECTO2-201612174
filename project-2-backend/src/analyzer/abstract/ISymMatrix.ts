import { MatrixTypes } from "../enums/EnumMatrix";
import { ISymbol } from "../sym_table/ISymbol";

export interface ISymMatrix {
  id: string;
  type: MatrixTypes;
  columns: number;
  rows: number;
  value: ISymbol[][];
}
