Blockly.Blocks["mouseX"] = {
	init: function(){
		this.setOutput(true, "Number");
		this.appendDummyInput()
			.appendField("mouseX")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(false, null);
		this.setNextStatement(false, null);
		this.setTooltip("");
	}
};

Blockly.Blocks["mouseY"] = {
	init: function(){
		this.setOutput(true, "Number");
		this.appendDummyInput()
			.appendField("mouseY")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(false, null);
		this.setNextStatement(false, null);
		this.setTooltip("");
	}
};
