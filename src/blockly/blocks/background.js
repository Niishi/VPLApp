Blockly.Blocks["background_1"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("background")
		this.appendValueInput("input_0")
			.appendField("color")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};

Blockly.Blocks["background_3"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("background")
		this.appendValueInput("input_0")
			.appendField("red")
		this.appendValueInput("input_1")
			.appendField("green")
		this.appendValueInput("input_2")
			.appendField("blue")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
