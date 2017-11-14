Blockly.Blocks["void_clear"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("clear")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
