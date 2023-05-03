import { Datatype } from "../enums/EnumDatatype";

export interface IReturnEval {
  value: string | number | boolean;
  type: Datatype;
}
