const acorn = require("acorn");
const escodegenDan = require("./escodegen");

class Parser {
  parseForSort(code) {
    let comments = [],
      tokens = [];
    let replaceCodeWithJS = code.replace(/#/gi, "//");
    let ast = acorn.parse(replaceCodeWithJS, {
      // collect ranges for each node
      ranges: true,
      // collect comments in Esprima's format
      onComment: comments,
      // collect token ranges
      onToken: tokens,
      ecmaVersion: 8,
    });

    const _ast = ast;
    // attach comments using collected information
    escodegenDan.attachComments(_ast, comments, tokens);
    // generate code
    const result = escodegenDan.generate(_ast, {
      comment: true,
      format: {
        quotes: "double",
        semicolons: false,
        space: "",
      },
    });

    if (result === "") {
      return `#코드 창에 아래의 코드를 입력해 보세요. \n#print("안녕하세요") \n\n`;
    } else {
      return result.replace(/\/{2}/gi, "#");
    }
  }
}

export default new Parser();
