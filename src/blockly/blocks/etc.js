Blockly.Blocks['expression_statement'] = {
  init: function() {
    this.appendValueInput("EXPR")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['unary'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([["-","MINUS"], ["+","PLUS"], ["~","CHILDA"], ["!","NOT"], ["delete","DELETE"], ["typeof","TYPEOF"], ["void","VOID"]]), "OP");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['constants'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["TWO_PI","TWO_PI"], ["PI","PI"], ["HALF_PI","HALF_PI"], ["QUARTER_PI","QUARTER_PI"], ["TAU","TAU"], ["DEGREES","DEGREES"], ["RADIANDS","RADIANS"]]), "CONST");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['assingment_expression'] = {
    init: function() {
        this.appendValueInput("VAL")
            .setCheck(null)
            .appendField(new Blockly.FieldVariable("item"), "NAME")
            .appendField(new Blockly.FieldDropdown([["=","EQ"], ["+=","ADD"], ["-=","SUB"], ["*=","MULT"], ["/=","DIVISION"], ["%=","AMARI"], ["**=","BEKI"]]), "OP");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['member_block'] = {
    init: function() {
        this.appendValueInput("member")
            .setCheck(null)
            .appendField(new Blockly.FieldTextInput("default"), "NAME");
        this.setOutput(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['this_expression'] = {
    init: function() {
        this.appendValueInput("member")
            .setCheck(null)
            .appendField("this");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
