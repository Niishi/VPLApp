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
