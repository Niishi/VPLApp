Blockly.Blocks["void_createCanvas"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("createCanvas")
		this.appendValueInput("input_0")
			.setCheck("Num")
			.appendField("width")
		this.appendValueInput("input_1")
			.setCheck("Num")
			.appendField("height")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
