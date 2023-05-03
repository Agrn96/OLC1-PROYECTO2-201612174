export enum Terminals {
  DECIMAL = "DECIMAL", // 0-9
  INTEGER = "INTEGER", // 0-9
  LOGICAL = "LOGICAL", // true, false
  STRING = "STRING", // "string" or 'string' or `string`
  ID = "ID", // a-z, A-Z, _ (underscore) and 0-9 (not at the beginning) // TODO: add support for unicode characters
  CHAR = "CHAR", // 'char' or "char" or `char` // TODO: add support for unicode characters
}
