Blockly.Blocks['setup'] = {
  init: function() {
    this.appendStatementInput("SETUP_METHODS")
        .setCheck(null)
        .appendField("setup");
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['draw'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("draw");
    this.setInputsInline(true);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
