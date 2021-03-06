Blockly.p5js['no_return_function'] = function(block) {
  const value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
  let code = value_name + '(';
  let tab = '';
  for(let i = 0; i < block.argLength; i++){
      code += tab + (Blockly.p5js.valueToCode(block, 'ARG'+i, Blockly.p5js.ORDER_ATOMIC));
      if(!tab) tab = ', ';
  }
  code += ');\n';
  return code;
};

Blockly.p5js['return_function'] = function(block) {
    const value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    let code = value_name + '(';
    let tab = '';
    for(let i = 0; i < block.argLength; i++){
        code += tab + (Blockly.p5js.valueToCode(block, 'ARG'+i, Blockly.p5js.ORDER_ATOMIC));
        if(!tab) tab = ', ';
    }
    code += ')';
    return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['new_expression'] = function(block) {
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var code = 'new ' + value_name + '(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
      code += tab + (Blockly.p5js.valueToCode(block, 'ARG'+i, Blockly.p5js.ORDER_ATOMIC));
      if(!tab) tab = ', ';
    }
    code += ')';
    return [code, Blockly.p5js.ORDER_ATOMIC];
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

Blockly.p5js['function_expression'] = function(block) {
    var statements_body = Blockly.p5js.statementToCode(block, 'BODY');
    var code = 'function( ';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
        code += tab + block.getFieldValue('PARAM' + i);
        if(!tab) tab = ', ';
    }
    code += '){\n';
    code += statements_body;
    code += '}';    //expressionなので末尾にセミコロンや改行文字は不要。それらはexpressionStatementブロックがやってくれる
    return [code, Blockly.p5js.ORDER_ATOMIC];
};
