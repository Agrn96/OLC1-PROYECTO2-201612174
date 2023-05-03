import { ISemanticResult } from "../abstract/ISemanticResult";
import { Datatype } from "../enums/EnumDatatype";
import { RelationalOp } from "../enums/EnumRelational";
import { SemanticErrorEx } from "../exceptions/SemanticErrorEx";
import fnCharToInt from "./fnCharToInt";

const fnSemanticRelational = (
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
      [Datatype.CHAR]: Datatype.BOOLEAN,
      [Datatype.STRING]: null,
    },
    [Datatype.DOUBLE]: {
      [Datatype.INT]: Datatype.BOOLEAN,
      [Datatype.DOUBLE]: Datatype.BOOLEAN,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: Datatype.BOOLEAN,
      [Datatype.STRING]: null,
    },
    [Datatype.BOOLEAN]: {
      [Datatype.INT]: null,
      [Datatype.DOUBLE]: null,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: null,
      [Datatype.STRING]: null,
    },
    [Datatype.CHAR]: {
      [Datatype.INT]: Datatype.BOOLEAN,
      [Datatype.DOUBLE]: Datatype.BOOLEAN,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: Datatype.BOOLEAN,
      [Datatype.STRING]: null,
    },
    [Datatype.STRING]: {
      [Datatype.INT]: null,
      [Datatype.DOUBLE]: null,
      [Datatype.BOOLEAN]: null,
      [Datatype.CHAR]: null,
      [Datatype.STRING]: null,
    },
  };

  const type: Datatype = semanticTable[left_type][right_type]!;

  if (type === null) {
    throw new SemanticErrorEx(
      "Cannot compare two booleans or two chars.",
      line,
      column
    );
  } else if (type === Datatype.STRING) {
    throw new SemanticErrorEx("Cannot compare two strings.", line, column);
  } else {
    switch (operator) {
      case RelationalOp.GREATER_THAN:
        const semanticResult1 = {
          [Datatype.INT]: {
            [Datatype.INT]: Number(left_value) > Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) > Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) > Number(right_value),
            [Datatype.STRING]: null,
          },
          [Datatype.DOUBLE]: {
            [Datatype.INT]: Number(left_value) > Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) > Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              Number(left_value) > fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.BOOLEAN]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
          [Datatype.CHAR]: {
            [Datatype.INT]:
              fnCharToInt(left_value.toString()) > Number(right_value),
            [Datatype.DOUBLE]:
              fnCharToInt(left_value.toString()) > Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) >
              fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.STRING]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
        };

        const value1 = semanticResult1[left_type][right_type]!;
        return { value: value1, type };
      case RelationalOp.GREATER_THAN_EQUAL:
        const semanticResult2 = {
          [Datatype.INT]: {
            [Datatype.INT]: Number(left_value) >= Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) >= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) >= Number(right_value),
            [Datatype.STRING]: null,
          },
          [Datatype.DOUBLE]: {
            [Datatype.INT]: Number(left_value) >= Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) >= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              Number(left_value) >= fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.BOOLEAN]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
          [Datatype.CHAR]: {
            [Datatype.INT]:
              fnCharToInt(left_value.toString()) >= Number(right_value),
            [Datatype.DOUBLE]:
              fnCharToInt(left_value.toString()) >= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) >=
              fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.STRING]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
        };

        const value2 = semanticResult2[left_type][right_type]!;
        return { value: value2, type };
      case RelationalOp.LESS_THAN:
        const semanticResult3 = {
          [Datatype.INT]: {
            [Datatype.INT]: Number(left_value) < Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) < Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) < Number(right_value),
            [Datatype.STRING]: null,
          },
          [Datatype.DOUBLE]: {
            [Datatype.INT]: Number(left_value) < Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) < Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              Number(left_value) < fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.BOOLEAN]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
          [Datatype.CHAR]: {
            [Datatype.INT]:
              fnCharToInt(left_value.toString()) < Number(right_value),
            [Datatype.DOUBLE]:
              fnCharToInt(left_value.toString()) < Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) <
              fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.STRING]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
        };

        const value3 = semanticResult3[left_type][right_type]!;
        return { value: value3, type };
      case RelationalOp.LESS_THAN_EQUAL:
        const semanticResult4 = {
          [Datatype.INT]: {
            [Datatype.INT]: Number(left_value) <= Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) <= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) <= Number(right_value),
            [Datatype.STRING]: null,
          },
          [Datatype.DOUBLE]: {
            [Datatype.INT]: Number(left_value) <= Number(right_value),
            [Datatype.DOUBLE]: Number(left_value) <= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              Number(left_value) <= fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.BOOLEAN]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
          [Datatype.CHAR]: {
            [Datatype.INT]:
              fnCharToInt(left_value.toString()) <= Number(right_value),
            [Datatype.DOUBLE]:
              fnCharToInt(left_value.toString()) <= Number(right_value),
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]:
              fnCharToInt(left_value.toString()) <=
              fnCharToInt(right_value.toString()),
            [Datatype.STRING]: null,
          },
          [Datatype.STRING]: {
            [Datatype.INT]: null,
            [Datatype.DOUBLE]: null,
            [Datatype.BOOLEAN]: null,
            [Datatype.CHAR]: null,
            [Datatype.STRING]: null,
          },
        };

        const value4 = semanticResult4[left_type][right_type]!;
        return { value: value4, type };
      default:
        throw new SemanticErrorEx("Invalid relational operator.", line, column);
    }
  }
};

export default fnSemanticRelational;
