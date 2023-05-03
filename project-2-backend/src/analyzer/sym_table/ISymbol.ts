import { Datatype } from "../enums/EnumDatatype";

export interface ISymbol {
  id: string;
  datatype: Datatype;
  line: number;
  column: number;
  value: number | string | boolean;
}
