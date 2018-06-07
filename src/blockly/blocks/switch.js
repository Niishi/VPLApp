Blockly.Blocks['switch_block'] = {
    init: function() {
        this.appendValueInput("DISCRIMINANT")
            .setCheck(null)
            .appendField("switch");
        this.appendStatementInput("CASES")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['case_block'] = {
    init: function() {
        this.appendValueInput("TEST")
            .setCheck(null)
            .appendField("case");
        this.appendStatementInput("CONSEQUENTS")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['default_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("default");
        this.appendStatementInput("CONSEQUENTS")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
