Blockly.p5js['array_block'] = function(block) {
  var code = '[';
  var punctuater = ', ';
  for(var i = 0; i < block.argLength-1; i++){
      var value = Blockly.p5js.valueToCode(block, 'value'+i, Blockly.p5js.ORDER_ATOMIC);
      if(i == block.argLength - 2){
          code += value;
          break;
      }
      code += value + punctuater;
  }
  code += ']';
  return [code, Blockly.p5js.ORDER_ATOMIC];
};

Blockly.p5js['array_member'] = function(block) {
  var value_name = Blockly.p5js.valueToCode(block, 'name', Blockly.p5js.ORDER_ATOMIC);
  var value_index = Blockly.p5js.valueToCode(block, 'index', Blockly.p5js.ORDER_ATOMIC);
  var code = value_name + '[' + value_index + ']';
  return [code, Blockly.p5js.ORDER_ATOMIC];
};
