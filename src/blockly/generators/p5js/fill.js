Blockly.p5js['fill'] = function(block) {
  var colour_fillcolor = block.getFieldValue('fillColor');
  // TODO: Assemble p5js into code variable.
  var code = 'fill(' + colour_fillcolor + ");\n";
  return code;
};
