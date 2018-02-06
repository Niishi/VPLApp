Blockly.Blocks['no_return_function'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("functionName"), "FUNCTION_NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
        this.argLength = 0;
    },
    createValueInput: function(count) {
        for(var i = 0; i < count; i++){
            var input = this.appendValueInput('ARG' + i)
                .setAlign(Blockly.ALIGN_RIGHT);
            input.init();
            this.argLength++;
        }
    }
};

Blockly.Blocks['return_function'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("functionName"), "FUNCTION_NAME");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
        this.argLength = 0;
    },
    createValueInput: function(count) {
        for(var i = 0; i < count; i++){
            var input = this.appendValueInput('ARG' + i)
                .setAlign(Blockly.ALIGN_RIGHT);
            input.init();
            this.argLength++;
        }
    }
};
