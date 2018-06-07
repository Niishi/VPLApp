Blockly.p5js['switch_block'] = function(block) {
    var value_discriminant = Blockly.p5js.valueToCode(block, 'DISCRIMINANT', Blockly.p5js.ORDER_ATOMIC);
    var statements_cases = Blockly.p5js.statementToCode(block, 'CASES');
    var code = 'switch(' + value_discriminant + '){\n';
    code += statements_cases;
    code += '}\n';
    return code;
};

Blockly.p5js['case_block'] = function(block) {
    var value_test = Blockly.p5js.valueToCode(block, 'TEST', Blockly.p5js.ORDER_ATOMIC);
    var statements_consequents = Blockly.p5js.statementToCode(block, 'CONSEQUENTS');
    var code = 'case ' + value_test + ":\n";
    code += statements_consequents + "\n";
    return code;
};

Blockly.p5js['default_block'] = function(block) {
  var statements_consequents = Blockly.p5js.statementToCode(block, 'CONSEQUENTS');
  var code = 'default:\n';
  code += statements_consequents + "\n";
  return code;
};
