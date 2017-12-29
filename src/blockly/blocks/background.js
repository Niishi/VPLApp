Blockly.Blocks["background"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("background")
		this.appendValueInput("input_0")
			.setCheck(["Number", "Colour"])
			.appendField("color")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
