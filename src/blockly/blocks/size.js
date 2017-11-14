Blockly.Blocks['size'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("size")
        .appendField(new Blockly.FieldTextInput("800"), "X")
        .appendField(new Blockly.FieldTextInput("600"), "Y");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
