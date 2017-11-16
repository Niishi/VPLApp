Blockly.Blocks["noStroke"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("noStroke")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
