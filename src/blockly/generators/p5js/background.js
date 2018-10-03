Blockly.p5js["background_1"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	// TODO: Assemble p5js into code variable.
	var code = "";
	code += "background(";
	code += "" + value_input_0 + ");\n";

	return code;
};

Blockly.p5js["background_3"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	var value_input_1 = Blockly.p5js.valueToCode(block, "input_1", Blockly.p5js.ORDER_ATOMIC);
	var value_input_2 = Blockly.p5js.valueToCode(block, "input_2", Blockly.p5js.ORDER_ATOMIC);
	// TODO: Assemble p5js into code variable.
	var code = "";
	code += "background(";
	code += "" + value_input_0 + ", " + value_input_1 + ", " + value_input_2 + ");\n";

	return code;
};
