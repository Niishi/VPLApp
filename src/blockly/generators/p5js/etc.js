Blockly.p5js['expression_statement'] = function(block) {
  var value_expr = Blockly.p5js.valueToCode(block, 'EXPR', Blockly.p5js.ORDER_ATOMIC);
  // TODO: Assemble p5js into code variable.
  var code = value_expr + ';\n';
  return code;
};

Blockly.p5js['unary'] = function(block) {
    var dropdown_op = block.getFieldValue('OP');
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    switch(dropdown_op){
        case 'MINUS':
            code = '-' + value_name;
            break;
        case 'PLUS':
            code = '+' + value_name;
            break;
        case 'CHILDA':
            code = '~' + value_name;
            break;
        case 'NOT':
            code = '!' + value_name;
            break;
        case 'DELETE':
            code = 'delete(' + value_name + ')';
            break;
        case 'TYPEOF':
            code = 'typeof(' + value_name + ')';
            break;
        case 'VOID':
            code = 'void(' + value_name + ')';
            break;
        default:
            errorMessage("テキストに変換できません！unaryブロックにおける、存在しないdropdown_op" + dropdown_op);
    }
    return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['assingment_expression'] = function(block) {
  var variable_name = Blockly.p5js.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_val = Blockly.p5js.valueToCode(block, 'VAL', Blockly.p5js.ORDER_ATOMIC);
  // TODO: Assemble p5js into code variable.
  var code = variable_name + ' = ' + value_val;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.p5js.ORDER_NONE];
};

Blockly.p5js['member_block'] = function(block) {
    var text_name = block.getFieldValue('NAME');
    var value_member = Blockly.p5js.valueToCode(block, 'member', Blockly.p5js.ORDER_ATOMIC);
    var code = text_name;
    if(value_member !== "") code += "." + value_member;
    return [code, Blockly.p5js.ORDER_ATOMIC];
};