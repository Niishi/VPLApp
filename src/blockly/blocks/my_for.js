Blockly.Blocks['my_for'] = {
  init: function() {
    this.appendValueInput("INIT")
        .setCheck(null)
        .appendField("for")
        .appendField("初期");
    this.appendValueInput("TEST")
        .setCheck(null)
        .appendField("条件");
    this.appendValueInput("UPDATE")
        .setCheck(null)
        .appendField("更新");
    this.appendStatementInput("BODY")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['for_decl'] = {
    init: function() {
        this.appendStatementInput("NAME")
            .setCheck(null)
            .appendField("初期化");
        this.appendValueInput("COND")
            .setCheck(null)
            .appendField("条件");
        this.appendValueInput("UPDATE")
            .setCheck(null)
            .appendField("更新");
        this.appendStatementInput("STM")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['for_in'] = {
    init: function() {
        this.appendValueInput("LEFT")
            .setCheck(null)
            .appendField("for");
        this.appendValueInput("RIGHT")
            .setCheck(null)
            .appendField("in");
        this.appendStatementInput("BODY")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['for_of'] = {
    init: function() {
        this.appendValueInput("LEFT")
            .setCheck(null)
            .appendField("for");
        this.appendValueInput("RIGHT")
            .setCheck(null)
            .appendField("of");
        this.appendStatementInput("BODY")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['do_while'] = {
    init: function() {
        this.appendStatementInput("BODY")
            .setCheck(null)
            .appendField("do");
        this.appendValueInput("TEST")
            .setCheck(null)
            .appendField("whlile");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
