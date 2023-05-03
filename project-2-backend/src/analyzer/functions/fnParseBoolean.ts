import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";

const fnParseBoolean = (
  value: string,
  line: number,
  column: number
): boolean => {
  value = value.toLowerCase();
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new SemanticErrorEx("Invalid boolean value.", line, column);
  }
};

export default fnParseBoolean;
