Blockly.p5js['updateexpression'] = function(block) {
  var variable_var = Blockly.p5js.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var dropdown_ope = block.getFieldValue('OPE');
  // TODO: Assemble p5js into code variable.
  var ope = '';
  if(dropdown_ope === 'INC') ope = '++';
  else ope = '--';
  var code = variable_var + ope;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.p5js.ORDER_ATOMIC];
};
