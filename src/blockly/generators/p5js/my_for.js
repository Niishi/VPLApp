Blockly.p5js['my_for'] = function(block) {
  var value_init = Blockly.p5js.valueToCode(block, 'INIT', Blockly.p5js.ORDER_ATOMIC);
  var value_test = Blockly.p5js.valueToCode(block, 'TEST', Blockly.p5js.ORDER_ATOMIC);
  var value_update = Blockly.p5js.valueToCode(block, 'UPDATE', Blockly.p5js.ORDER_ATOMIC);
  var for_statements_body = Blockly.p5js.statementToCode(block, 'BODY');
  if(value_test == null || value_test == ""){
      value_test = "false"; //無限ループを防ぐために条件式にはfalseをとりあえずいれておく
  }
  var code = 'for ( ' + value_init + '; ' + value_test + '; ' + value_update + ' ) {\n' + for_statements_body + '}\n';
  return code;
};

Blockly.p5js['for_decl'] = function(block) {
    var statements_name = Blockly.p5js.statementToCode(block, 'NAME');
    var value_cond = Blockly.p5js.valueToCode(block, 'COND', Blockly.p5js.ORDER_ATOMIC);
    var value_update = Blockly.p5js.valueToCode(block, 'UPDATE', Blockly.p5js.ORDER_ATOMIC);
    var statements_stm = Blockly.p5js.statementToCode(block, 'STM');
    if(value_cond == null || value_cond == '') value_cond = "false";   //無限ループを防ぐために条件式にはfalseをとりあえずいれておく
    statements_name = statements_name.slice(0, -1); //初期化式の末尾の改行文字を取り除く
    while(statements_name.slice(0, 1) === ' ') statements_name = statements_name.slice(1);
    var code = 'for (' + statements_name + ' ' + value_cond + '; ' + value_update + ' ) {\n' +
        statements_stm + '}\n';
    return code;
};
