import { Extension } from "@codemirror/next/state";
import {
  delimitedIndent,
  foldNodeProp,
  indentNodeProp,
  LezerSyntax
} from "@codemirror/next/syntax";
import { parser } from "lezer-tex";
import { TeXTagSystem } from "./highlight";

/// A syntax provider based on the Lezer TeX parser, extended with
/// highlighting and indentation information.
export const texSyntax = LezerSyntax.define(
  (parser as any).withProps(
    indentNodeProp.add((type) => {
      if (type.name == "MathBlock")
        return delimitedIndent({ closing: "$$", align: false });
      return undefined;
    }),
    foldNodeProp.add({
      MathBlock(tree) {
        return { from: tree.start + 2, to: tree.end - 2 };
      },
      Environment(tree) {
        return { from: tree.firstChild!.firstChild!.end!, to: tree.lastChild!.lastChild!.start! };
      }
    }),
    TeXTagSystem.add({
      // Specific tokens
      "{ }": "brace",
      "[ ]": "squareBracket",
      ReservedChar: "operator",

      // Control sequence
      ControlSequenceName: "variableName",

      // Control sequences
      ControlSymbol: "atom",
      ControlWord: "atom",
      ControlSpace: "separator",
      ControlLine: "null",
      ControlNumber: "variableName",

      // Environment
      "BeginEnvironment EndEnvironment EnvEndCommand": "atom",
      MismatchedEnvEndCommand: "atom invalid",
      EnvironmentName: "namespace",

      // Verbatim
      "VerbContent VerbatimContent": "string#2 monospace",

      // Comment
      Comment: "comment",

      // Commands
      CommandName: "atom",

      // Text formatting commands
      textmd: "+semistrong",
      textbf: "+strong",
      "textit textsl": "+emphasis",
      textup: "+noemphasis",
      texttt: "+monospace",
      textnormal: "+normal",
      textsc: "+smallcap",
      underline: "+underline",

      // Math formatting commands
      "mathbf/Argument": "strong",
      "mathit/Argument": "emphasis",
      "mathtt/Argument": "monospace",
      "MathBlock MathLine": "string#2",
      MathContent: "string#2 emphasis"
    })
  ),
  {
    languageData: {
      closeBrackets: {
        brackets: ["(", "[", "{"],
        before: ")]}"
      },
      commentTokens: { line: "%" }
    }
  }
);

/// Returns an extension that installs TeX support features
/// (completion of [snippets](#lang-tex.snippets)).
export function texSupport(): Extension {
  return texSyntax.languageData.of({});
}

/// Returns an extension that installs the TeX syntax and
/// support features.
export function tex(): Extension {
  return [texSyntax, texSupport()];
}
