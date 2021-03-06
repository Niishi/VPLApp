Blockly.Blocks['no_return_function'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null);
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
        this.appendValueInput("NAME")
            .setCheck(null);
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

Blockly.Blocks['new_expression'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("new");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(45);
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

Blockly.Blocks['decl_function'] = {
    init: function() {
        this.appendDummyInput('TOP')
            .appendField("関数名")
            .appendField(new Blockly.FieldTextInput("default"), "NAME");
        this.appendStatementInput("statement")
            .setCheck(null);
        this.setInputsInline(false);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
        this.argLength = 0;
    },
    createValueInput: function(count){
        let input = this.getInput('TOP');
        for(var i = 0; i < count; i++){
            input.appendField(new Blockly.FieldTextInput("default"), "PARAM"+i);
            this.argLength++;
        }
        input.init();
    }
};

Blockly.Blocks['function_expression'] = {
    init: function() {
        this.appendDummyInput('TOP')
            .appendField("関数");
        this.appendStatementInput("BODY")
            .setCheck(null);
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
        this.argLength = 0;
    },
    createValueInput: function(count){
        let input = this.getInput('TOP');
        for(var i = 0; i < count; i++){
            input.appendField(new Blockly.FieldTextInput("default"), "PARAM"+i);
            this.argLength++;
        }
        input.init();
    }
};
