Blockly.p5js['rect'] = function(block) {
  var value_x = Blockly.p5js.valueToCode(block, 'x', Blockly.p5js.ORDER_ATOMIC);
  var value_y = Blockly.p5js.valueToCode(block, 'y', Blockly.p5js.ORDER_ATOMIC);
  var value_w = Blockly.p5js.valueToCode(block, 'w', Blockly.p5js.ORDER_ATOMIC);
  var value_h = Blockly.p5js.valueToCode(block, 'h', Blockly.p5js.ORDER_ATOMIC);
  // TODO: Assemble p5js into code variable.
  var code = 'rect(' + value_x + ", " + value_y + ", " + value_w + ", " + value_h + ");\n";
  return code;
};
