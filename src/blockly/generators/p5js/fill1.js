Blockly.p5js["void_fill"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	var code = "";
	code += "fill(";
	code += "" + value_input_0 + ");\n";

	return code;
};

Blockly.p5js["fill_3"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	var value_input_1 = Blockly.p5js.valueToCode(block, "input_1", Blockly.p5js.ORDER_ATOMIC);
	var value_input_2 = Blockly.p5js.valueToCode(block, "input_2", Blockly.p5js.ORDER_ATOMIC);
	var code = "";
	code += "fill(";
	code += "" + value_input_0 + ", " + value_input_1 + ", " + value_input_2 + ");\n";

	return code;
};
