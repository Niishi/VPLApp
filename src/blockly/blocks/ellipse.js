Blockly.Blocks["ellipse"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("ellipse")
		this.appendValueInput("input_0")
			.setCheck("Number")
			.appendField("x")
		this.appendValueInput("input_1")
			.setCheck("Number")
			.appendField("y")
		this.appendValueInput("input_2")
			.setCheck("Number")
			.appendField("r1")
		this.appendValueInput("input_3")
			.setCheck("Number")
			.appendField("r2")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
