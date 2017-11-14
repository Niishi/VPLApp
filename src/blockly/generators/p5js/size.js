Blockly.p5js['size'] = function(block) {
  var text_x = block.getFieldValue('X');
  var text_y = block.getFieldValue('Y');
  // TODO: Assemble p5js into code variable.
  var code = Blockly.p5js.INDENT + 'size('+text_x + ", " + text_y +");\n";
  return code;
};
