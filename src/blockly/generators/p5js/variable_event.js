Blockly.p5js['variable_event'] = function(block) {
  var dropdown_name = block.getField('NAME').getText();
  // TODO: Assemble p5js into code variable.
  var code = dropdown_name;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.p5js.ORDER_ATOMIC];
};
