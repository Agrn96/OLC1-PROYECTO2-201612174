import { IReturnEval } from "../abstract/IReturnEval";

export class ReturnEx extends Error {
  constructor(public value: IReturnEval | undefined) {
    super();
  }
}
