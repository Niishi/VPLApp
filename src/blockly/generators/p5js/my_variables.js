Blockly.p5js['var_decl'] = function(block) {
    var dropdown_kind = block.getFieldValue('KIND');
    var variable_name = Blockly.p5js.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
    var value_name = Blockly.p5js.valueToCode(block, 'name', Blockly.p5js.ORDER_ATOMIC);
    switch(dropdown_kind){
        case 'VAR':
        dropdown_kind = 'var';
        break;
        case 'CONST':
        dropdown_kind = 'const';
        break;
        case 'LET':
        dropdown_kind = 'let';
        break;
        default:
        errorMessage("var_declブロックでのテキスト変換においてdropdown_kindが定義されていません: " + dropdown_kind);
    }
    if(value_name !== ''){
        return dropdown_kind + ' ' +  variable_name + ' = ' + value_name + ';\n';
    }else{
        return dropdown_kind + ' ' + variable_name + ';\n';
    }
};
