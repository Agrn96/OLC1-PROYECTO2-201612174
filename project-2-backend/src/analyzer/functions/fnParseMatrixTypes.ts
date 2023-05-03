import { Datatype } from "../enums/EnumDatatype";
import { MatrixTypes } from "../enums/EnumMatrix";

const fnParseMatrixTypes = (type: Datatype): MatrixTypes => {
  switch (type) {
    case Datatype.INT:
      return MatrixTypes.INT_MATRIX;
    case Datatype.DOUBLE:
      return MatrixTypes.DOUBLE_MATRIX;
    case Datatype.STRING:
      return MatrixTypes.STRING_MATRIX;
    case Datatype.BOOLEAN:
      return MatrixTypes.BOOLEAN_MATRIX;
    case Datatype.CHAR:
      return MatrixTypes.CHAR_MATRIX;
  }
};

export default fnParseMatrixTypes;
