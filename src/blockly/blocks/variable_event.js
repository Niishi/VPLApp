Blockly.Blocks['variable_event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["width","WIDTH"], ["height","HEIGHT"], ["frameCount","FRAMECOUNT"]]), "NAME");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
