import "brace/mode/yaml";

// see https://github.com/securingsincity/react-ace/blob/master/docs/FAQ.md#how-do-i-add-a-custom-mode
// see https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/python_highlight_rules.js
export class CustomHighlightRules extends window.ace.acequire(
  "ace/mode/text_highlight_rules"
).TextHighlightRules {
  constructor() {
    super();
    this.$rules = {
      start: [
        {
          token: "comment",
          regex: "#.*$"
        },
        {
          token: "string",
          regex: '".*?"'
        },
        {
          token: "keyword",
          regex: "^(taxonomy|rules):"
        },
        {
          token: "keyword",
          regex: "- name:"
        },
        {
          token: "keyword",
          regex: "(action|priority|type|label):"
        },
        {
          token: "keyword",
          regex: "pattern: [|]?",
          next: "pattern"
        }
      ],
      pattern: [
        // on-the-fly named capture
        {
          token: "keyword",
          regex: "(?=[?][<])[a-zA-Z_]+?(?=[>])"
        },
        // @-style named capture
        {
          token: "keyword",
          regex: "(?:[@])([a-zA-Z_]+)(?=[:])"
        },
        // @-style named capture's type
        {
          token: "bold",
          regex: "(?:[:])([a-zA-Z_]+)"
        },
        // @-style mention (non-capture)
        {
          token: "bold",
          regex: "(?:[@])([a-zA-Z_]+)(?![:])"
        },
        // graph pattern trigger
        {
          token: "keyword",
          regex: "(?:[ ]*)trigger(?=[ ]*[=])"
        },
        // graph pattern arg name
        {
          token: "keyword",
          regex: "(?:[ ]*)[a-zA-Z_]+(?=[:])"
        },
        {
          // literal
          token: "string",
          regex: '".*?"'
        },
        {
          token : "keyword.operator",
          regex : "([?]<)|([=!&|@])|([>](?![a-zA-Z]))"
        },
        {
          token : "paren.lparen",
          regex : "[[(]"
        },
        {
          token : "paren.rparen",
          regex : "[[)]"
        },
        {
          // basic quantifiers
          token : "keyword.operator",
          regex : "[?+*](?![<])" // ensure it isn't a ?<capture>
        },
        {
          // ranged quantifiers
          token : "keyword.operator",
          regex : "([{][0-9]+,?[0-9]*[}][?]?)|([{],?[0-9]+[}][?]?)"
        },
        {
          token: "regexp",
          regex: "/.*?/"
        },
        {
          token: "bold",
          regex: "(word|lemma|tag|chunk|entity|incoming|outgoing|mention)(?=[=])"
        },
        // graph edge
        {
          token: "bold",
          regex: "(?![?])[><][a-zA-Z_:]+"
        },
        {
          token: "comment",
          regex: "#.*$"
        },
        {
          // NOTE: this isn't really a comment,
          // but we need a pattern to trigger
          // moving to the other state machine
          token: "comment",
          regex: "^[ ]*$",
          next: "start"
        }
      ]
    };
  }
}

export default class CustomOdinMode extends window.ace.acequire("ace/mode/yaml")
  .Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}
