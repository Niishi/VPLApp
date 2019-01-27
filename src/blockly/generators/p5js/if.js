Blockly.p5js['if'] = function(block) {
  var value_condition = Blockly.p5js.valueToCode(block,
                        'condition', Blockly.p5js.ORDER_ATOMIC);
  var statements_statement = Blockly.p5js.statementToCode(block, 'statement');
  var code = 'if (' + value_condition +') {\n';
  code += statements_statement;
  code += "}\n"
  return code;
};

Blockly.p5js['else'] = function(block) {
  var statements_statement = Blockly.p5js.statementToCode(block, 'statement');
  var code = 'else {\n';
  code += statements_statement;
  code += "}\n";
  return code;
};

Blockly.Blocks['else_if'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("Boolean")
        .appendField("else if");
    this.appendStatementInput("statement")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
