import { Request, Response } from "express";
import { IStatement } from "../analyzer/abstract/IStatement";
import { LexicalErrorEx } from "../analyzer/exceptions/LexicalErrorEx";
import { SyntaxErrorEx } from "../analyzer/exceptions/SyntaxErrorEx";
import { TsLanguageParser } from "../analyzer/ts-parser";

const image = (req: Request, res: Response) => {
  const parser = new TsLanguageParser();
  parser!.parseError = (_err: any, hash: any) => {
    throw new SyntaxErrorEx(
      `No se esperaba el token: ${hash.token}, Se esperaba: ${hash.expected}`,
      hash.loc.first_line,
      hash.loc.last_column
    );
  };

  const { text } = req.body;
  try {
    const ast: IStatement[] = parser.parse(text);
    const graph = `digraph G {
      rootNode [label=\"Raiz\"];\n
      node[shape=\"rectangle\"];\n
      splines=polyline;\n
      concentrate=true;\n
      ${ast
        .map((statement) => {
          return `rootNode -> node${statement.uuid};\n${statement.graph()}`;
        })
        .join("\n")} \n
    }`;

    res.status(200).json({
      graph,
    });
  } catch (error: unknown) {
    if (error instanceof SyntaxErrorEx) {
      res.status(200).json({
        cout: error.message,
      });
    } else if (error instanceof LexicalErrorEx) {
      res.status(200).json({
        cout: error.message,
      });
    } else {
      console.error(error);
      throw error;
    }
  }
};
export default image;
