Blockly.Blocks['try_block'] = {
    init: function() {
        this.appendStatementInput("BLOCK")
            .setCheck(null)
            .appendField("try");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['catch_block'] = {
    init: function() {
        this.appendValueInput("PARAM")
            .setCheck(null)
            .appendField("式");
        this.appendStatementInput("BLOCK")
            .setCheck(null)
            .appendField("catch");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['finally_block'] = {
    init: function() {
        this.appendStatementInput("BLOCK")
            .setCheck(null)
            .appendField("finally");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['throw_block'] = {
    init: function() {
        this.appendValueInput("EXPR")
            .setCheck(null)
            .appendField("throw");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
