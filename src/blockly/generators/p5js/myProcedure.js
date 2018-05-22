Blockly.p5js['no_return_function'] = function(block) {
  var text_function_name = block.getFieldValue('FUNCTION_NAME');
  var code = text_function_name + '(';
  let tab = '';
  for(var i = 0; i < block.argLength; i++){
      code += tab + (Blockly.p5js.valueToCode(block, 'ARG'+i, Blockly.p5js.ORDER_ATOMIC));
      if(!tab) tab = ', ';
  }
  code += ');\n';
  return code;
};

Blockly.p5js['return_function'] = function(block) {
    var text_function_name = block.getFieldValue('FUNCTION_NAME');
    var code = text_function_name + '(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
        code += tab + (Blockly.p5js.valueToCode(block, 'ARG'+i, Blockly.p5js.ORDER_ATOMIC));
        if(!tab) tab = ', ';
    }
    code += ')';
    return [code, Blockly.p5js.ORDER_NONE];
};

Blockly.p5js['decl_function'] = function(block) {
    var text_name = block.getFieldValue('NAME');
    var statements_statement = Blockly.p5js.statementToCode(block, 'statement');
    var code = 'function ' + text_name + '(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
        code += tab + block.getFieldValue('PARAM' + i);
        if(!tab) tab = ', ';
    }
    code += '){\n';
    code += statements_statement;
    code += '}\n';
    return code;
};
