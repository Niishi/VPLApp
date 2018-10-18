Blockly.Blocks["void_fill"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("fill")
		this.appendValueInput("input_0")
			.setCheck(["Number", "Colour"])
			.appendField("gray")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};

Blockly.Blocks["fill_3"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("fill")
		this.appendValueInput("input_0")
			.setCheck(["Number", "Colour"])
			.appendField("red")
		this.appendValueInput("input_1")
			.setCheck(["Number", "Colour"])
			.appendField("green")
		this.appendValueInput("input_2")
			.setCheck(["Number", "Colour"])
			.appendField("blue")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
