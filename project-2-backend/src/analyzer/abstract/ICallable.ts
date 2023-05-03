import { Datatype } from "../enums/EnumDatatype";
import { IParam } from "./IParam";
import { IStatement } from "./IStatement";

export interface ICallable extends IStatement {
  id: string;
  body: IStatement[];
  params: IParam[] | undefined;
  datatype: Datatype | undefined;
}
