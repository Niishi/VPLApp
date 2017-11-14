Blockly.Blocks['background'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("background")
        .appendField(new Blockly.FieldColour("#cccccc"), "BACKGROUND_COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
