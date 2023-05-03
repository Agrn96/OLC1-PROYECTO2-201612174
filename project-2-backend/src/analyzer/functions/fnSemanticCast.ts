import { Datatype } from "../enums/EnumDatatype";

const fnSemanticCast = (origin: Datatype, destiny: Datatype): boolean => {
  const semanticTable = {
    [Datatype.INT]: {
      [Datatype.INT]: true,
      [Datatype.DOUBLE]: true,
      [Datatype.BOOLEAN]: true,
      [Datatype.CHAR]: true,
      [Datatype.STRING]: true,
    },
    [Datatype.DOUBLE]: {
      [Datatype.INT]: true,
      [Datatype.DOUBLE]: true,
      [Datatype.BOOLEAN]: false,
      [Datatype.CHAR]: false,
      [Datatype.STRING]: true,
    },
    [Datatype.BOOLEAN]: {
      [Datatype.INT]: true,
      [Datatype.DOUBLE]: true,
      [Datatype.BOOLEAN]: true,
      [Datatype.CHAR]: true,
      [Datatype.STRING]: true,
    },
    [Datatype.CHAR]: {
      [Datatype.INT]: true,
      [Datatype.DOUBLE]: true,
      [Datatype.BOOLEAN]: true,
      [Datatype.CHAR]: true,
      [Datatype.STRING]: true,
    },
    [Datatype.STRING]: {
      [Datatype.INT]: true,
      [Datatype.DOUBLE]: true,
      [Datatype.BOOLEAN]: true,
      [Datatype.CHAR]: true,
      [Datatype.STRING]: true,
    },
  };

  return semanticTable[origin][destiny]!;
};

export default fnSemanticCast;
