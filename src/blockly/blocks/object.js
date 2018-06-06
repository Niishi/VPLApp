Blockly.Blocks['object_block'] = {
    init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("object");
        this.setOutput(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['property_block'] = {
    init: function() {
        this.appendValueInput("KEY")
            .setCheck(null);
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField(":");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
