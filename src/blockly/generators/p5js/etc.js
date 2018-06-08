Blockly.p5js['expression_statement'] = function(block) {
    var value_expr = Blockly.p5js.valueToCode(block, 'EXPR', Blockly.p5js.ORDER_ATOMIC);
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
  var variable_name = Blockly.p5js.valueToCode(block, 'LEFT', Blockly.p5js.ORDER_ATOMIC);
  var dropdown_op = block.getFieldValue('OP');
  switch(dropdown_op){
      case 'EQ':
          dropdown_op = '=';
          break;
      case 'ADD':
          dropdown_op = '+=';
          break;
      case 'SUB':
          dropdown_op = '-=';
          break;
      case 'MULT':
          dropdown_op = '*=';
          break;
      case 'DIVISION':
          dropdown_op = '/=';
          break;
      case 'AMARI':
          dropdown_op = '%=';
          break;
      case 'BEKI':
          dropdown_op = '**=';
          break;
      default:
          errorMessage("assingment_expressionブロックのテキスト変換において、以下のoperatorは定義されていません: " +
            dropdown_op + "\n\n面倒くさくて実装していません。本当にごめんなさい。")
  }
  var value_val = Blockly.p5js.valueToCode(block, 'VAL', Blockly.p5js.ORDER_ATOMIC);
  var code = variable_name + ' ' + dropdown_op + ' ' + value_val;
  return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['member_block'] = function(block) {
    var value_left = Blockly.p5js.valueToCode(block, 'LEFT', Blockly.p5js.ORDER_ATOMIC);
    var value_right = Blockly.p5js.valueToCode(block, 'RIGHT', Blockly.p5js.ORDER_ATOMIC);
    var code = value_left + '.' + value_right;
    return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['this_expression'] = function(block) {
    var value_value = Blockly.p5js.valueToCode(block, 'VALUE', Blockly.p5js.ORDER_ATOMIC);
    var code = 'this';
    return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['return_statement'] = function(block) {
    var value_value = Blockly.p5js.valueToCode(block, 'VALUE', Blockly.p5js.ORDER_ATOMIC);
    var code = 'return ' + value_value + ';\n';
    return code;
};

Blockly.p5js['break_statement'] = function(block) {
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var code = 'break;\n';
    if(value_name) code = value_name + " : " + code;
    return code;
};

Blockly.p5js['continue_statement'] = function(block) {
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var code = 'continue;\n';
    if(value_name) code = value_name + " : " + code;
    return code;
};

Blockly.p5js['null_block'] = function(block) {
    var code = 'null';
    return [code, Blockly.p5js.ORDER_ATOMIC];
};
