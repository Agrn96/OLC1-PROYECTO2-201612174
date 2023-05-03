import { ArrayTypes } from "../enums/EnumArray";
import { Datatype } from "../enums/EnumDatatype";

const fnParseArrayTypes = (type: Datatype): ArrayTypes => {
  switch (type) {
    case Datatype.INT:
      return ArrayTypes.INT_ARRAY;
    case Datatype.DOUBLE:
      return ArrayTypes.DOUBLE_ARRAY;
    case Datatype.STRING:
      return ArrayTypes.STRING_ARRAY;
    case Datatype.BOOLEAN:
      return ArrayTypes.BOOLEAN_ARRAY;
    case Datatype.CHAR:
      return ArrayTypes.CHAR_ARRAY;
  }
};

export default fnParseArrayTypes;
