Blockly.p5js['class_decl'] = function(block) {
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var value_super = Blockly.p5js.valueToCode(block, 'SUPER', Blockly.p5js.ORDER_ATOMIC);
    var statements_body = Blockly.p5js.statementToCode(block, 'BODY');
    var code = 'class ' + value_name;
    if(value_super) code += ' extends ' + value_super;
    code +='{\n';
    code += statements_body;
    code += '}\n'
    return code;
};

Blockly.p5js['method'] = function(block) {
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var checkbox_name = block.getFieldValue('NAME') == 'TRUE';
    var statements_body = Blockly.p5js.statementToCode(block, 'BODY');
    let code = "";


    if(checkbox_name) code +=  "static ";
    code += value_name + '(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
        code += tab + block.getFieldValue('PARAM' + i);
        if(!tab) tab = ', ';
    }
    code += '){\n';
    code += statements_body;
    code += '}\n';
    return code;
};

Blockly.p5js['constructor'] = function(block) {
    var statements_body = Blockly.p5js.statementToCode(block, 'BODY');
    var code = 'constructor(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
      code += tab + block.getFieldValue('PARAM' + i);
      if(!tab) tab = ', ';
    }
    code += '){\n';
    code += statements_body;
    code += '}\n';
    return code;
};

Blockly.p5js['getset_method'] = function(block) {
    var dropdown_kind = block.getFieldValue('KIND');
    var value_name = Blockly.p5js.valueToCode(block, 'NAME', Blockly.p5js.ORDER_ATOMIC);
    var checkbox_name = block.getFieldValue('NAME') == 'TRUE';
    var statements_body = Blockly.p5js.statementToCode(block, 'BODY');
    let code = "";
    if(checkbox_name) code += checkbox_name + " ";
    code += dropdown_kind + " ";
    code += value_name + '(';
    let tab = '';
    for(var i = 0; i < block.argLength; i++){
      code += tab + block.getFieldValue('PARAM' + i);
      if(!tab) tab = ', ';
    }
    code += '){\n';
    code += statements_body;
    code += '}\n';
    return code;
};
