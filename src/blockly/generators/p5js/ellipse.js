Blockly.p5js["void_ellipse"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	var value_input_1 = Blockly.p5js.valueToCode(block, "input_1", Blockly.p5js.ORDER_ATOMIC);
	var value_input_2 = Blockly.p5js.valueToCode(block, "input_2", Blockly.p5js.ORDER_ATOMIC);
	var value_input_3 = Blockly.p5js.valueToCode(block, "input_3", Blockly.p5js.ORDER_ATOMIC);
	// TODO: Assemble p5js into code variable.
	var code = "";
	code += "ellipse(";
	code += "" + value_input_0 + "," + value_input_1 + "," + value_input_2 + "," + value_input_3 + ");\n";

	return code;
};
