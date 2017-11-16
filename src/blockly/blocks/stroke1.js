Blockly.Blocks["stroke"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("stroke")
		this.appendValueInput("input_0")
			.setCheck("Number")
			.appendField("red")
		this.appendValueInput("input_1")
			.setCheck("Number")
			.appendField("green")
		this.appendValueInput("input_2")
			.setCheck("Number")
			.appendField("blue")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
