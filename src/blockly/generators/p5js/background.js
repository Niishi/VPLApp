Blockly.p5js['background'] = function(block) {
  var colour_background_color = block.getFieldValue('BACKGROUND_COLOR');
  // TODO: Assemble p5js into code variable.
  var code = Blockly.p5js.INDENT + 'background(' + '"' + colour_background_color + '"' +");\n";
  return code;
};
