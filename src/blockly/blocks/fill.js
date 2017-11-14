Blockly.Blocks['fill'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fill")
        .appendField(new Blockly.FieldColour("#cccccc"), "fillColor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
