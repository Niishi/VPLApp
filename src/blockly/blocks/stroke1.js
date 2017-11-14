Blockly.Blocks["void_stroke"] = {
	init: function(){
		this.appendDummyInput()
			.appendField("stroke")
		this.appendValueInput("input_0")
			.setCheck("Num")
			.appendField("red")
		this.appendValueInput("input_1")
			.setCheck("Num")
			.appendField("green")
		this.appendValueInput("input_2")
			.setCheck("Num")
			.appendField("blue")
		this.setColour(230);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip("");
	}
};
