import { Datatype } from "../enums/EnumDatatype";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";

const fnParseDatatype = (
  datatype: string,
  line: number,
  column: number
): Datatype => {
  switch (datatype.toLowerCase()) {
    case "int":
      return Datatype.INT;
    case "double":
      return Datatype.DOUBLE;
    case "string":
      return Datatype.STRING;
    case "boolean":
      return Datatype.BOOLEAN;
    case "char":
      return Datatype.CHAR;
    default:
      throw new SemanticErrorEx(
        `Datatype ${datatype} not supported`,
        line,
        column
      );
  }
};

export default fnParseDatatype;
