Blockly.Blocks["Canvas_createCanvas"] = {
	init: function(){
		this.setOutput(true, "Canvas");
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
		this.setPreviousStatement(false, null);
		this.setNextStatement(false, null);
		this.setTooltip("");
	}
};
