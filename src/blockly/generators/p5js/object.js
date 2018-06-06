Blockly.p5js['object_block'] = function(block) {
    var statements_name = Blockly.p5js.statementToCode(block, 'NAME');
    var code = '{\n';
    code += statements_name;
    code += '}';
    return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['property_block'] = function(block) {
    var value_key =
        Blockly.p5js.valueToCode(block, 'KEY', Blockly.p5js.ORDER_ATOMIC);
    var value_value =
        Blockly.p5js.valueToCode(block, 'VALUE', Blockly.p5js.ORDER_ATOMIC);
    var code = value_key + " : " + value_value;
    if(block.getNextBlock()) code += ',';
    code += '\n';
    return code;
};
