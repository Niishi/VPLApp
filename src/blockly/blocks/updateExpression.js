Blockly.Blocks['updateexpression'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField(new Blockly.FieldDropdown([["++","INC"], ["--","DEC"]]), "OPE");
    this.setOutput(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
