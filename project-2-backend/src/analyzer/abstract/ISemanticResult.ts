import { Datatype } from "../enums/EnumDatatype";

export interface ISemanticResult {
  value: string | number | boolean;
  type: Datatype;
}
