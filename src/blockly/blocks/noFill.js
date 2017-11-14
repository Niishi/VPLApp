Blockly.Blocks["void_noFill"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("noFill")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
