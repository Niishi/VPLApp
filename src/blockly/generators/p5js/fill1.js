Blockly.p5js["void_fill"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	// TODO: Assemble p5js into code variable.
	var code = "";
	code += "fill(";
	code += "" + value_input_0 + ");\n";

	return code;
};
