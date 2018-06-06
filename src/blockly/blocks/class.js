Blockly.Blocks['class_decl'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("class");
        this.appendValueInput("SUPER")
            .setCheck(null)
            .appendField("extends");
        this.appendStatementInput("BODY")
            .setCheck(null);
        this.setInputsInline(true);
        this.setColour(60);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['method'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("name");
        this.appendDummyInput('TOP');
        this.appendStatementInput("BODY")
            .setCheck(null)
            .appendField("static")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
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

Blockly.Blocks['constructor'] = {
    init: function() {
        this.appendDummyInput('TOP')
            .appendField("constructor");
        this.appendStatementInput("BODY")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
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

Blockly.Blocks['getset_method'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([["get","get"], ["set","set"]]), "KIND")
            .appendField("name");
        this.appendDummyInput('TOP');
        this.appendStatementInput("BODY")
            .setCheck(null)
            .appendField("static")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
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
