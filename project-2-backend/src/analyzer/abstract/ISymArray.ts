import { ArrayTypes } from "../enums/EnumArray";
import { ISymbol } from "../sym_table/ISymbol";

export interface ISymArray {
  id: string;
  type: ArrayTypes;
  size: number;
  value: ISymbol[];
}
