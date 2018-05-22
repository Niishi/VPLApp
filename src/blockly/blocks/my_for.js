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
