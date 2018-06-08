Blockly.p5js['try_block'] = function(block) {
    var statements_name = Blockly.p5js.statementToCode(block, 'BLOCK');
    var code = 'try{\n';
    code += statements_name;
    code += '}\n'
    return code;
};

Blockly.p5js['catch_block'] = function(block) {
    var value_param = Blockly.p5js.valueToCode(block, 'PARAM', Blockly.p5js.ORDER_ATOMIC);
    var statements_block = Blockly.p5js.statementToCode(block, 'BLOCK');
    var code = 'catch(' + value_param + '){\n';
    code += statements_block;
    code += '}\n'
    return code;
};

Blockly.p5js['finally_block'] = function(block) {
    var statements_block = Blockly.p5js.statementToCode(block, 'BLOCK');
    var code = 'finally{\n';
    code += statements_block;
    code += '}\n';
    return code;
};

Blockly.p5js['throw_block'] = function(block) {
    var value_expr = Blockly.p5js.valueToCode(block, 'EXPR', Blockly.p5js.ORDER_ATOMIC);
    var code = 'throw ' + value_expr + ';\n';
    return code;
};
