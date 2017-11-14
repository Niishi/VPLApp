Blockly.Blocks["void_colorMode"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("colorMode")
		this.appendValueInput("input_0")
			.setCheck("int")
			.appendField("mode")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
