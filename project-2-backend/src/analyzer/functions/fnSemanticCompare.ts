import { ISemanticResult } from "../abstract/ISemanticResult";
import { Datatype } from "../enums/EnumDatatype";
import { RelationalOp } from "../enums/EnumRelational";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import fnCharToInt from "./fnCharToInt";

const fnSemanticCompare = (
  left_type: Datatype,
  right_type: Datatype,
  left_value: string | number | boolean,
  right_value: string | number | boolean,
  operator: RelationalOp,
  line: number,
  column: number
): ISemanticResult => {
  const semanticTable = {
    [Datatype.INT]: {
      [Datatype.INT]: Datatype.BOOLEAN,
      [Datatype.DOUBLE]: Datatype.BOOLEAN,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: null,
      [Datatype.STRING]: null,
    },
    [Datatype.DOUBLE]: {
      [Datatype.INT]: Datatype.BOOLEAN,
      [Datatype.DOUBLE]: Datatype.BOOLEAN,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: null,
      [Datatype.STRING]: null,
    },
    [Datatype.BOOLEAN]: {
      [Datatype.INT]: null,
      [Datatype.DOUBLE]: null,
      [Datatype.BOOLEAN]: Datatype.BOOLEAN,
      [Datatype.CHAR]: null,
      [Datatype.STRING]: null,
    },
    [Datatype.CHAR]: {
      [Datatype.INT]: null,
      [Datatype.DOUBLE]: null,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: Datatype.BOOLEAN,
      [Datatype.STRING]: Datatype.BOOLEAN,
    },
    [Datatype.STRING]: {
      [Datatype.INT]: null,
      [Datatype.DOUBLE]: null,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: Datatype.BOOLEAN,
      [Datatype.STRING]: Datatype.BOOLEAN,
    },
  };

  const type: Datatype = semanticTable[left_type][right_type]!;

  if (type === null) {
    throw new SemanticErrorEx("Cannot compare different types.", line, column);
  }

  switch (operator) {
    case RelationalOp.EQUAL:
      const semanticResult1 = {
        [Datatype.INT]: {
          [Datatype.INT]: Number(left_value) === Number(right_value),
          [Datatype.DOUBLE]: Number(left_value) === Number(right_value),
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.DOUBLE]: {
          [Datatype.INT]: Number(left_value) === Number(right_value),
          [Datatype.DOUBLE]: Number(left_value) === Number(right_value),
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.BOOLEAN]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: Boolean(left_value) === Boolean(right_value),
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.CHAR]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]:
            fnCharToInt(left_value.toString()) ===
            fnCharToInt(right_value.toString()),
          [Datatype.STRING]: left_value.toString() === right_value.toString(),
        },
        [Datatype.STRING]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: left_value.toString() === right_value.toString(),
          [Datatype.STRING]: left_value.toString() === right_value.toString(),
        },
      };
      const value1 = semanticResult1[left_type][right_type]!;

      return { value: value1, type };
    case RelationalOp.NOT_EQUAL:
      const semanticResult2 = {
        [Datatype.INT]: {
          [Datatype.INT]: Number(left_value) !== Number(right_value),
          [Datatype.DOUBLE]: Number(left_value) !== Number(right_value),
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.DOUBLE]: {
          [Datatype.INT]: Number(left_value) !== Number(right_value),
          [Datatype.DOUBLE]: Number(left_value) !== Number(right_value),
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.BOOLEAN]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: Boolean(left_value) !== Boolean(right_value),
          [Datatype.CHAR]: null,
          [Datatype.STRING]: null,
        },
        [Datatype.CHAR]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]:
            fnCharToInt(left_value.toString()) !==
            fnCharToInt(right_value.toString()),
          [Datatype.STRING]: left_value.toString() !== right_value.toString(),
        },
        [Datatype.STRING]: {
          [Datatype.INT]: null,
          [Datatype.DOUBLE]: null,
          [Datatype.BOOLEAN]: null,
          [Datatype.CHAR]: left_value.toString() !== right_value.toString(),
          [Datatype.STRING]: left_value.toString() !== right_value.toString(),
        },
      };
      const value2 = semanticResult2[left_type][right_type]!;

      return { value: value2, type };

    default:
      throw new SemanticErrorEx("Invalid operator.", line, column);
  }
};

export default fnSemanticCompare;
