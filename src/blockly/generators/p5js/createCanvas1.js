Blockly.p5js["Canvas_createCanvas"] = function(block) {
	var value_input_0 = Blockly.p5js.valueToCode(block, "input_0", Blockly.p5js.ORDER_ATOMIC);
	var value_input_1 = Blockly.p5js.valueToCode(block, "input_1", Blockly.p5js.ORDER_ATOMIC);
	// TODO: Assemble p5js into code variable.
	var code = "";
	code += "createCanvas(";
	code += "" + value_input_0 + "," + value_input_1 + ")";

	// TODO: Change ORDER_ATOMIC to the correct strength.
	return [code, Blockly.p5js.ORDER_ATOMIC];
};
