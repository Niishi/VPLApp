Blockly.Blocks['rect_4'] = {
    init: function() {
        this.appendValueInput("x")
            .setCheck("Number")
            .appendField("rect");
        this.appendValueInput("y")
            .setCheck("Number");
        this.appendValueInput("w")
            .setCheck("Number");
        this.appendValueInput("h")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");

        // this.collapsed = false;
    }

}
